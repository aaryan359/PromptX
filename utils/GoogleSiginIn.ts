import { GoogleSignin } from '@react-native-google-signin/google-signin';



export const configureGoogleSignIn = () => {
	console.log("google sigin in configred")
	GoogleSignin.configure({
		webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
	});
};


export const googleLogin = async () => {
	await GoogleSignin.hasPlayServices();
	await GoogleSignin.signOut();
	const userInfo = await GoogleSignin.signIn();
	console.log(" user info in utils function", userInfo)
	
	return {
		idToken: userInfo.data?.idToken!,
		user: userInfo.data?.user
	};
};