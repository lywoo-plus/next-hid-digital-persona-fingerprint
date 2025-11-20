'use client'

import { cn } from '@/lib/utils'
import { FingerprintSigninControl } from '@/types/fingerprint-signin-control'
import { SampleFormat, SamplesAcquired } from '@digitalpersona/devices'
import { useMount, useUnmount } from 'ahooks'
import { FingerprintIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from './ui/button'

type FingerprintStatus = 'idle' | 'capturing' | 'success' | 'error'

export default function FingerprintButton(props: {
  isActive: boolean
  label: string
  value: string | undefined

  onClick: () => void
  onCompleted: (fingerprint: Base64URLString | undefined) => void
}) {
  const [status, setStatus] = useState<FingerprintStatus>('idle')

  const statusColor = useMemo(() => {
    switch (status) {
      case 'idle':
        return 'text-gray-500'
      case 'capturing':
        return 'text-blue-500 animate-blink'
      case 'success':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }, [status])

  const [capturedFingerprint, setCapturedFingerprint] = useState<Base64URLString | undefined>()

  // Fingerprint SDK
  const [fingerprintSigninControl, setFingerprintSigninControl] = useState<
    FingerprintSigninControl | undefined
  >()

  useMount(() => {
    setFingerprintSigninControl(new FingerprintSigninControl())
  })

  useUnmount(() => {
    fingerprintSigninControl?.destroy()
  })

  fingerprintSigninControl?.reader?.on('SamplesAcquired', async (e: SamplesAcquired) => {
    // Fingerprint base64 image
    let base64 = String(e.samples[0])
    base64 = base64.replace(/_/g, '/')
    base64 = base64.replace(/-/g, '+')
    const fingerprintBase64Image = `data:image/png;base64,${base64}`

    setCapturedFingerprint(fingerprintBase64Image)
    props.onCompleted(fingerprintBase64Image)

    await fingerprintSigninControl.reader?.stopAcquisition(e.deviceId)

    setStatus('success')
  })

  useEffect(() => {
    if (props.isActive) {
      startCapture()
    } else {
      if (status === 'capturing') {
        stopCapture()
      }
    }
  }, [props.isActive])

  useEffect(() => {
    if (props.value === undefined) {
      setCapturedFingerprint(undefined)
      setStatus('idle')
      props.onCompleted(undefined)
    }
  }, [props.value])

  async function startCapture() {
    try {
      setStatus('capturing')
      fingerprintSigninControl?.reader?.startAcquisition(SampleFormat.PngImage)
    } catch (error) {
      console.log('start capture error:', error)
    }
  }

  async function stopCapture() {
    try {
      setStatus('idle')
      fingerprintSigninControl?.reader?.stopAcquisition()

      if (capturedFingerprint) {
        setStatus('success')
      }
    } catch (error) {
      console.log('stop capture error:', error)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        type="button"
        onClick={props.onClick}
        className="size-28 border shadow-md"
        variant={'ghost'}
      >
        <div className="flex flex-col items-center space-y-2">
          {capturedFingerprint ? (
            <img src={capturedFingerprint} alt="" className="size-20" />
          ) : (
            <FingerprintIcon className={cn('size-10', statusColor)} />
          )}
        </div>
      </Button>

      <span className="text-xs capitalize">{props.label}</span>
    </div>
  )
}
