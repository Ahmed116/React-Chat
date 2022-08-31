import { CustomDialog, useDialog } from 'react-st-modal'

const getGifImage = (value) => {
    switch (value) {
      case 'lego1':
        return Images.lego1
      case 'lego2':
        return Images.lego2
      case 'lego3':
        return Images.lego3
      case 'lego4':
        return Images.lego4
      case 'lego5':
        return Images.lego5
      case 'lego6':
        return Images.lego6
      case 'mimi1':
        return Images.mimi1
      case 'mimi2':
        return Images.mimi2
      case 'mimi4':
        return Images.mimi4
      case 'mimi5':
        return Images.mimi5
      case 'mimi6':
        return Images.mimi6
      case 'mimi7':
        return Images.mimi7
      case 'mimi8':
        return Images.mimi8
      case 'mimi9':
        return Images.mimi9
      default:
        return null
    }
  }

function CustomDialogContent({ defaultValue }) {
  const dialog = useDialog()

  const [value, setValue] = useState()

  return (
    <div>
      <input
        type='text'
        value={value ? value : defaultValue}
        onChange={(e) => {
          setValue(e.target.value)
        }}
      />
        <div className='viewBottom'>
          <img
            className='icOpenGallery'
            src={Images.input_file}
            alt='icon open gallery'
            onClick={() => this.refInput.click()}
          />
          <input
            ref={(el) => {
              this.refInput = el
            }}
            accept='image/*'
            className='viewInputGallery'
            type='file'
            onChange={this.onChoosePhoto}
          />

          <img
            className='icOpenSticker'
            src={Images.sticker}
            alt='icon open sticker'
            onClick={this.openListSticker}
          />

          <input
            className='viewInput'
            placeholder='Type a message'
            value={this.state.inputValue}
            onChange={(event) => {
              this.setState({ inputValue: event.target.value })
            }}
            onKeyPress={this.onKeyboardPress}
          />
          <img
            className='icSend'
            src={Images.send}
            alt='icon send'
            onClick={() => this.onSendMessage(this.state.inputValue, 0)}
          />
        </div>

      <button
        onClick={() => {
          // Сlose the dialog and return the value
          dialog.close(value)
        }}
      >
        Custom button
      </button>
    </div>
  )
}

export default CustomDialogContent
