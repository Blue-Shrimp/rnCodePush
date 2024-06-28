import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import codePush, {
  DownloadProgress,
  RemotePackage,
} from 'react-native-code-push';

interface Progress {
  receivedBytes: number;
  totalBytes: number;
}

const App: React.FC = () => {
  const [updateInfo, setUpdateInfo] = useState<RemotePackage | null>(null);
  const [progress, setProgress] = useState<Progress>({
    receivedBytes: 0,
    totalBytes: 0,
  });

  useEffect(() => {
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    try {
      const update = await codePush.checkForUpdate();
      if (update) {
        setUpdateInfo(update);
        startUpdate();
      } else {
        console.log('No updates available');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  const startUpdate = () => {
    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
      },
      status => {
        switch (status) {
          case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            console.log('Checking for updates.');
            break;
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            console.log('Downloading package.');
            break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
            console.log('Installing update.');
            break;
          case codePush.SyncStatus.UP_TO_DATE:
            console.log('Up-to-date.');
            break;
          case codePush.SyncStatus.UPDATE_INSTALLED:
            console.log('Update installed.');
            break;
          default:
            break;
        }
      },
      (progress: DownloadProgress) => {
        console.log(
          `Received bytes: ${progress.receivedBytes}, Total bytes: ${progress.totalBytes}`,
        );
        setProgress({
          receivedBytes: progress.receivedBytes,
          totalBytes: progress.totalBytes,
        });
      },
    );
  };

  return (
    <View style={styles.container}>
      {updateInfo ? (
        <View style={styles.updateInfo}>
          <Text>App Version: {updateInfo.appVersion}</Text>
          <Text>Label: {updateInfo.label}</Text>
          <Text>Mandatory: {updateInfo.isMandatory ? 'Yes' : 'No'}</Text>
          <Text>
            Description: {updateInfo.description || 'No description available'}
          </Text>
          <Text>
            Progress: {progress.receivedBytes}/{progress.totalBytes} bytes
          </Text>
        </View>
      ) : (
        <Text>No updates available</Text>
      )}
      <Button title="Check for Updates" onPress={checkForUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  updateInfo: {
    marginBottom: 20,
  },
});

export default codePush(App);
