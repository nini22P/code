import { StatusBar } from 'expo-status-bar';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import IconButton from './components/IconButton';
import CircleButton from './components/CircleButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library'
import * as FileSystem from 'expo-file-system'
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image'

const PlaceholderImage = require('./assets/images/background-image.png')

export default function App() {

  const imageRef = useRef()

  const [status, requestPermisson] = MediaLibrary.usePermissions()

  // 检查权限
  if (status === null) {
    requestPermisson()
  }

  const [pickedEmoji, setPickedEmoji] = useState(null)
  const [isModalVisible, setIsModalVisble] = useState(false)
  const [showAppOptions, setShowAppOptions] = useState(false)
  const [selectedImage, setSelectedmage] = useState<string | null>(null)


  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedmage(result.assets[0].uri)
      setShowAppOptions(true)
    } else {
      alert('You did not selet any image.')
    }
  }

  const onReset = () => {
    setShowAppOptions(false)
  }

  const onAddSticker = () => {
    setIsModalVisble(true)
  }

  const onModalClose = () => {
    setIsModalVisble(false)
  }

  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        })

        const asset = await MediaLibrary.createAssetAsync(localUri)
        const result = await MediaLibrary.createAlbumAsync('StickerSmash', asset, false)

        if (result) {
          alert('Saved!')
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        const dataUri = await domtoimage.toPng(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 448,
        })

        let link = document.createElement('a')
        link.download = 'sticker-smash.png'
        link.href = dataUri
        link.click()
      } catch (e) {
        console.log(e)
      }
    }
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSoure={pickedEmoji} />}
        </View>
      </View>
      {
        showAppOptions
          ? (
            <View style={styles.optionsContainer}>
              <View style={styles.optionsRow}>
                <IconButton icon='refresh' label='Reset' onPress={onReset} />
                <CircleButton onPress={onAddSticker} />
                <IconButton icon='save-alt' label='Save' onPress={onSaveImageAsync} />
              </View>
            </View>
          )
          : (
            <View style={styles.footerContainer}>
              <Button theme='primary' label='Choose a photo' onPress={pickImageAsync} />
              <Button label='Use this photo' onPress={() => setShowAppOptions(true)} />
            </View>
          )
      }
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
