import { StyleSheet } from 'react-native'

import EditScreenInfo from '@/components/EditScreenInfo'
import { Text, View } from '@/components/Themed'

export default function TabOneScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>PEC1</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 50,
		fontWeight: 'bold',
    color: '#6a00ff'
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%'
	}
})
