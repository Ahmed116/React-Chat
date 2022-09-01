import { useState, useRef } from 'react'
import { useDialog } from 'react-st-modal'
import Images from '../ProjectImages/ProjectImages'
import firebase from '../Services/firebase'
import LoginString from '../Pages/Login/LoginStrings'
import moment from 'moment'
import './CustomDialog.css'


function CustomDialogContent({
  defaultValue,
  showToast,
  item,
  currentPeerUser,
  groupChatId,
}) {
  console.log(item)
  const dialog = useDialog()
  const refInput = useRef(null)
  const [isShowSticker, setIsShowSticker] = useState(false)
  const [loading, setLoading] = useState(false)
  const renderStickers = () => {
    return (
      <div className='viewStickers'>
        <img
          className='imgSticker'
          src={Images.lego1}
          alt='sticker'
          onClick={() => {
            onSendMessage('lego1', 2)
          }}
        />
        <img
          className='imgSticker'
          src={Images.lego2}
          alt='sticker'
          onClick={() => onSendMessage('lego2', 2)}
        />
        <img
          className='imgSticker'
          src={Images.lego3}
          alt='sticker'
          onClick={() => onSendMessage('lego3', 2)}
        />
        <img
          className='imgSticker'
          src={Images.lego4}
          alt='sticker'
          onClick={() => onSendMessage('lego4', 2)}
        />
        <img
          className='imgSticker'
          src={Images.lego5}
          alt='sticker'
          onClick={() => onSendMessage('lego5', 2)}
        />
        <img
          className='imgSticker'
          src={Images.lego6}
          alt='sticker'
          onClick={() => onSendMessage('lego6', 2)}
        />

        <img
          className='imgSticker'
          src={Images.mimi1}
          alt='sticker'
          onClick={() => onSendMessage('mimi1', 2)}
        />
        <img
          className='imgSticker'
          src={Images.mimi2}
          alt='sticker'
          onClick={() => onSendMessage('mimi2', 2)}
        />

        <img
          className='imgSticker'
          src={Images.mimi4}
          alt='sticker'
          onClick={() => onSendMessage('mimi4', 2)}
        />
        <img
          className='imgSticker'
          src={Images.mimi5}
          alt='sticker'
          onClick={() => onSendMessage('mimi5', 2)}
        />
        <img
          className='imgSticker'
          src={Images.mimi6}
          alt='sticker'
          onClick={() => onSendMessage('mimi6', 2)}
        />
        <img
          className='imgSticker'
          src={Images.mimi7}
          alt='sticker'
          onClick={() => onSendMessage('mimi7', 2)}
        />
        <img
          className='imgSticker'
          src={Images.mimi8}
          alt='sticker'
          onClick={() => onSendMessage('mimi8', 2)}
        />
        <img
          className='imgSticker'
          src={Images.mimi9}
          alt='sticker'
          onClick={() => onSendMessage('mimi9', 2)}
        />
      </div>
    )
  }
  const onSendMessage = (content, type) => {
    if (isShowSticker && type === 2) {
      setIsShowSticker(false)
    }
    if (content.trim() === '') {
      return
    }

    const itemMessage = {
      content: content.trim(),
      type: type,
    }

    firebase
      .firestore()
      .collection('Messages')
      .doc(groupChatId)
      .collection(groupChatId)
      .doc(item.timestamp)
      .update(itemMessage)
      .then((r) => console.log(r))

    firebase
      .firestore()
      .collection('users')
      .doc(currentPeerUser.documentkey)
      .update({ unReadMessages: currentPeerUser.unReadMessages + 1 })
      .then((data) => {})
      .catch((err) => {
        showToast(0, err.toString())
      })
    dialog.close(value)
  }

  const onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      setLoading(true)
      const currentPhotoFile = event.target.files[0]
      const prefixFiletype = event.target.files[0].type.toString()
      if (prefixFiletype.indexOf('image/') === 0) {
        uploadPhoto(currentPhotoFile)
      } else {
        setLoading(false)
        showToast(0, 'This file is not an image')
      }
    } else {
      setLoading(false)
    }
  }

  const uploadPhoto = (currentPhotoFile) => {
    if (currentPhotoFile) {
      const timestamp = moment().valueOf().toString()

      const uploadTask = firebase
        .storage()
        .ref()
        .child(timestamp)
        .put(currentPhotoFile)

      uploadTask.on(
        LoginString.UPLOAD_CHANGED,
        null,
        (err) => {
          setLoading(false)
          showToast(0, err.message)
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setLoading(false)
            onSendMessage(downloadURL, 1)
          })
        }
      )
    } else {
      setLoading(false)
      showToast(0, 'File is null')
    }
  }

  const openListSticker = () => {
    setIsShowSticker(!isShowSticker)
  }

  const [value, setValue] = useState()

  return (
    <div className='main'>
      <div className='viewBottom'>
        <input
          type='text'
          value={value ? value : defaultValue}
          onChange={(e) => {
            setValue(e.target.value)
          }}
        />
        <img
          className='icOpenGallery'
          src={Images.input_file}
          alt='icon open gallery'
          onClick={() => refInput?.current?.click?.()}
        />
        <input
          ref={refInput}
          accept='image/*'
          className='viewInputGallery'
          type='file'
          onChange={onChoosePhoto}
        />

        <img
          className='icOpenSticker'
          src={Images.sticker}
          alt='icon open sticker'
          onClick={openListSticker}
        />
      </div>
      {isShowSticker ? renderStickers() : null}
          <div className='btn'>
      <button
      className='updateBtn'
        onClick={() => {
          // Сlose the dialog and return the value
          onSendMessage(value, 0)
        }}
      >
        Update
      </button>
      <button
      className='deleteBtn'
        onClick={async () => {
          await firebase
            .firestore()
            .collection('Messages')
            .doc(groupChatId)
            .collection(groupChatId)
            .doc(item.timestamp)
            .delete()

          dialog.close()
        }}
      >
        Delete
      </button>
      </div>
    </div>
  )
}

export default CustomDialogContent
