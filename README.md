# Getting Started

> Last Updated: 11/6/2022

## Running Locally

To get started with running the client:

1. Build the project locally: `npm i && npm start`
1. Open an iOS Simulator (via xCode) and/or Android Device Emulator (via Android Studio)
1. In the terminal window running the project, type `i` to open on iOS Simulator or `a` to open on Android Device Emulator. Follow the prompts on the respective device emulator.
1. Alternatively, you can run the application on a physical device by scanning the QR code displayed in the terminal. (Press `c` to get the code again.)

## Deploying new versions

1. Install EAS CLI global on by running `npm install -g eas-cli`
2. Log into EAS by running `eas login`
3. Updates can occur in 2 forms. **Minor** updates and **Major** builds. Minor updates, which will likely be the most common updates, can be updated with the following command: `eas build --platform ios --channel production`

## Log in to the _App Store_

# Known Errors

| File Impacted/ Issue                                                          | Error's Context                                                                                                                                                                                                                                                                                                                                | Temporary Solution                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ImageUploader                                                                 | [TypeError: Network request failed when fetching a file:// uri]                                                                                                                                                                                                                                                                                | We used [sjchmiela](https://github.com/sjchmiela) apprach using XML. The code is stable and works at this given moment.                                                                                                                        |
| Upgrading Expo from SDK 44 to 45                                              | [TypeError: undefined is not an object (evaluating 'NativeUnimoduleProxy.viewManagersNames.includes')]                                                                                                                                                                                                                                         | Run `expo install expo-modules-core`. This can happen if you delete the `node_module` folder.                                                                                                                                                  |
| Cannot use the AuthSession proxy because the project full name is not defined | Cannot use the AuthSession proxy because the project full name is not defined. Prefer AuthRequest (with the useProxy option set to false) in combination with an Expo Development Client build of your application. To continue using the AuthSession proxy, specify the project full name (@owner/slug) using the projectNameForProxy option. | If you run into this error above, then add `"originalFullName": "Elite Personal Chefs",` to the app.json file. I added mine underneath the owner property. You can run npx expo start per usual and navigate to the screen you need to get to. |
| Reanimate Version                                                             | [Reanimated Couldn't determine the version of the native part of Reanimated. Did you forget to re-build the app after upgrading react-native-reanimated? If you use Expo Go, you must use the exact version which is bundled into Expo SDK.]                                                                                                   | Follow the Expo Go installation                                                                                                                                                                                                                |

[typeerror: network request failed when fetching a file:// uri]: https://github.com/expo/expo/issues/2402#issuecomment-443726662
[typeerror: undefined is not an object (evaluating 'nativeunimoduleproxy.viewmanagersnames.includes')]: https://stackoverflow.com/questions/72487854/typeerror-undefined-is-not-an-object-evaluating-nativeunimoduleproxy-viewmana
[reanimated couldn't determine the version of the native part of reanimated. did you forget to re-build the app after upgrading react-native-reanimated? if you use expo go, you must use the exact version which is bundled into expo sdk.]: https://stackoverflow.com/questions/58131602/unable-to-resolve-module-react-native-reanimated
