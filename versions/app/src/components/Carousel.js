import * as React from "react";
import { Dimensions, Text, View, Image, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";

function Index(image) {
	let images = image.image;
	let imageLength = images?.length || 0;

	const width = Dimensions.get("window").width;
	const height = Dimensions.get("window").height;

	return (
		<View style={{ flex: 1 }}>
			<Carousel
				loop
				width={width}
				height={width / 2}
				autoPlay={false}
				data={[...new Array(imageLength).keys()]}
				// data={[...new Array(images.length).keys()]}
				scrollAnimationDuration={1000}
				// onSnapToItem={(index) => console.log("current index:", index)}
				renderItem={({ index }) => (
					<View
						style={{
							flex: 1,
							borderWidth: 1,
							justifyContent: "center",
						}}
					>
						<Image
							style={{ width: width, height: height * 0.25 }}
							source={{ uri: images[index] }}
							resizeMode='cover'
						/>
					</View>
				)}
			/>
		</View>
	);
}

export default Index;
