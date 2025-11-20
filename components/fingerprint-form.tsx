'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import FingerprintButton from './fingerprint-button'
import { Button } from './ui/button'
import { Field } from './ui/field'

const formSchema = z.object({
  leftPinky: z.custom<Base64URLString>().optional(),
  leftRing: z.custom<Base64URLString>().optional(),
  leftMiddle: z.custom<Base64URLString>().optional(),
  leftIndex: z.custom<Base64URLString>().optional(),
  leftThumb: z.custom<Base64URLString>().optional(),

  rightThumb: z.custom<Base64URLString>().optional(),
  rightIndex: z.custom<Base64URLString>().optional(),
  rightMiddle: z.custom<Base64URLString>().optional(),
  rightRing: z.custom<Base64URLString>().optional(),
  rightPinky: z.custom<Base64URLString>().optional(),
})

type FormFields = z.infer<typeof formSchema>

type FingerpringFields = {
  name: keyof FormFields
  label: string
}[]

const LEFT_FINGERPRINTS: FingerpringFields = [
  { name: 'leftPinky', label: 'pinky' },
  { name: 'leftRing', label: 'ring' },
  { name: 'leftMiddle', label: 'middle' },
  { name: 'leftIndex', label: 'index' },
  { name: 'leftThumb', label: 'thumb' },
]

const RIGHT_FINGERPRINTS: FingerpringFields = [
  { name: 'rightThumb', label: 'thumb' },
  { name: 'rightIndex', label: 'index' },
  { name: 'rightMiddle', label: 'middle' },
  { name: 'rightRing', label: 'ring' },
  { name: 'rightPinky', label: 'pinky' },
]

export default function FingerprintForm() {
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  const [selectedFingerprint, setSelectedFingerprint] = useState<
    keyof FormFields | undefined
  >()

  function onSubmit(values: FormFields) {
    console.log(values)
  }

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle className="text-xl">Fingerprints</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          id="fingerprint-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <section className="space-y-4">
            <h2 className="font-semibold">Left</h2>
            <div className="flex justify-between gap-4">
              {LEFT_FINGERPRINTS.map((fp) => (
                <Controller
                  key={fp.name}
                  name={fp.name}
                  control={form.control}
                  render={({ field }) => (
                    <FingerprintButton
                      key={fp.name}
                      value={field.value}
                      isActive={selectedFingerprint === fp.name}
                      label={fp.label}
                      onClick={() => {
                        setSelectedFingerprint(
                          selectedFingerprint === fp.name ? undefined : fp.name
                        )
                      }}
                      onCompleted={(fingerprint) => {
                        form.setValue(fp.name, fingerprint)
                      }}
                    />
                  )}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold">Right</h2>
            <div className="flex justify-between gap-4">
              {RIGHT_FINGERPRINTS.map((fp) => (
                <Controller
                  key={fp.name}
                  name={fp.name}
                  control={form.control}
                  render={({ field }) => (
                    <FingerprintButton
                      key={fp.name}
                      value={field.value}
                      isActive={selectedFingerprint === fp.name}
                      label={fp.label}
                      onClick={() => {
                        setSelectedFingerprint(
                          selectedFingerprint === fp.name ? undefined : fp.name
                        )
                      }}
                      onCompleted={(fingerprint) => {
                        form.setValue(fp.name, fingerprint)
                      }}
                    />
                  )}
                />
              ))}
            </div>
          </section>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation={'vertical'} className="flex justify-end gap-2">
          <Button className="flex-1" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button className="flex-1" type="submit" form="fingerprint-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
