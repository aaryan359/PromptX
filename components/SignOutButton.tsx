import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native'

interface SignOutButtonProps {
    style?: StyleProp<ViewStyle>
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ style }) => {
    // Use `useClerk()` to access the `signOut()` function
    const { signOut } = useClerk()

    const handleSignOut = async (): Promise<void> => {
        try {
            await signOut()
            // Redirect to your desired page
            Linking.openURL(Linking.createURL('/'))
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <TouchableOpacity style={style} onPress={handleSignOut}>
            <Text>Sign out</Text>
        </TouchableOpacity>
    )
}