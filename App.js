import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

const { width, height } = Dimensions.get('screen');

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [Photo, setPhoto] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      console.log('---------------------');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const snap = async () => {
    if (camera) {
      let photo = await camera.takePictureAsync();
      setPhoto(photo.uri);
    }
  };
  return (
    <View style={styles.container}>
      <Camera
        ref={(ref) => {
          camera = ref;
        }}
        style={styles.camera}
        type={type}
        ratio={'4:3'}
        onFacesDetected={(face) => {
          if (face.faces[0]) {
            if (
              face.faces[0].bounds.origin.y < height / 2 &&
              face.faces[0].bounds.origin.y > height / 5 &&
              face.faces[0].bounds.origin.x < width / 1 &&
              face.faces[0].bounds.origin.x > width / 6 - 100 &&
              face.faces[0].leftEyeOpenProbability > 0.99 &&
              face.faces[0].rightEyeOpenProbability > 0.99
            ) {
              console.log('in range', face.faces[0].bounds.origin.x);
              //alert('detected');
              snap();
            }
            //console.log(face.faces[0].bounds.origin.x);
          }

          //console.log(face.faces[0].bounds.origin.x);
        }}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.accurate,
          detectLandmarks: FaceDetector.Constants.Landmarks.none,
          runClassifications: FaceDetector.Constants.Classifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      >
        {Photo ? (
          <Image
            source={{ uri: Photo }}
            style={{
              width: width,
              height: height,
            }}
          />
        ) : (
          <View
            style={{
              borderWidth: 2,
              borderColor: 'red',
              borderStyle: 'solid',
              width: width / 1 - width / 5,
              height: height / 2 - height / 10,
              marginLeft: width / 6 - 20,
              marginTop: height / 5,
            }}
          ></View>
        )}
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
