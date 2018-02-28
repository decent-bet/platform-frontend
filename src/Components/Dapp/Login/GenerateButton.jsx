import React from 'react'
import { FlatButton } from 'material-ui'

const constants = require('../../Constants')

export default function GenerateButton({
  loginType,
  onGenerateMnemonicListener,
  onGeneratePrivateKeyListener
}) {
  if (loginType === constants.LOGIN_MNEMONIC) {
      return (
          <FlatButton
              className="generate"
              onClick={onGenerateMnemonicListener}
              label="Generate Passphase"
              icon={<i className="fa fa-reset" />}
          />
      )
  } else if (loginType === constants.LOGIN_PRIVATE_KEY) {
      return (
          <FlatButton
              className="generate"
              onClick={onGeneratePrivateKeyListener}
              label="Generate Private Key"
          />
      )
  }
}