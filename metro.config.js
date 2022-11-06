// const { getDefaultConfig } = require("metro-config");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

module.exports = config;


// module.exports = (async () => { 
// 	const {  
// 		resolver: { 
// 			sourceExts, 
// 			assetExts 
// 		}  
// 	} = await getDefaultConfig(); 

// 	return {
// 		transformer: {      
// 			babelTransformerPath: require.resolve("react-native-svg-transformer")    
// 		},    
// 		resolver: {
// 			assetExts: assetExts.filter(ext => ext !== "svg"),
// 			sourceExts: [...sourceExts, "js", "ts", "jsx", "tsx", "json", "svg"]    
// 		}};
// })();