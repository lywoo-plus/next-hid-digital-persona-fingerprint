'use client'

import { FingerprintReader } from '@digitalpersona/devices'

export class FingerprintSigninControl {
  reader: FingerprintReader | undefined = undefined

  constructor() {
    this.reader = new FingerprintReader()
  }

  async destroy() {
    this.reader?.off()
    delete this.reader
  }
}
