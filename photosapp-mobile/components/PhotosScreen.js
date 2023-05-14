import React, { Component } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as MediaLibrary from "expo-media-library";
import OnePhoto from './OnePhoto';


var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height



class PhotosScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numColumns: 5,
            arrayOfPics: [],
            photoWidth: 0,
            photoHeight: 0,
            removeArray: [],
            changeState: true

        };
        this.refresh = this.refresh.bind(this);

    }

    async componentDidMount() {

        let adressData = await SecureStore.getItemAsync("adressData");
        if (!adressData) {
            await SecureStore.setItemAsync("adressData", JSON.stringify(
                [
                    {
                        ip: '192.168.0.157',
                        port: '5000',
                        webPort: '3000'

                    }
                ]
            ));
        }
        adressData = JSON.parse(await SecureStore.getItemAsync("adressData"))


        let obj = await MediaLibrary.getAssetsAsync({
            sortBy: [[MediaLibrary.SortBy.creationTime, false]],
            first: 10,
            mediaType: 'photo'
        })

        obj.assets.map((pic) => {
            pic.toRemove = false
        })

        this.setState({
            arrayOfPics: obj.assets,
            photoWidth: ((Dimensions.get('window').width) / 5) - 9,
            photoHeight: ((Dimensions.get('window').width) / 5) - 9,
            adressData: adressData

        });

    }
    async refresh() {
        let obj = await MediaLibrary.getAssetsAsync({
            sortBy: [[MediaLibrary.SortBy.creationTime, false]],
            first: 10,
            mediaType: 'photo'
        })
        obj.assets.map((pic) => {
            pic.toRemove = false
        })

        this.setState({
            arrayOfPics: obj.assets,
            removeArray: []
        });

    }

    addToRemoveArray = (id) => {

        this.state.arrayOfPics.map((pic) => {
            if (id == pic.id) {

                if (pic.toRemove == false) {
                    let obj = {
                        id: pic.id,
                        uri: pic.uri,
                        type: 'image/jpeg',
                        name: pic.filename,
                    }
                    pic.toRemove = true
                    this.state.removeArray.push(obj)

                } else if (pic.toRemove == true) {
                    pic.toRemove = false
                    var filtered = this.state.removeArray.filter(function (value, index, arr) {
                        return value.id != id;
                    });
                    this.setState({
                        removeArray: filtered
                    });

                }

            }
        })
        this.setState({
            changeState: !this.state.changeState
        });

    }

    openCamera = () => {
        this.props.navigation.navigate('CameraScreen', { onGoBack: () => this.refresh() })
    }

    openSettings = () => {
        this.props.navigation.navigate('SettingsScreen', { onGoBack: () => this.refresh() })
    }

    changeView = () => {

        if (this.state.photoWidth > (width / 2)) {
            this.setState({
                photoWidth: ((Dimensions.get('window').width) / 5) - 9,
                photoHeight: ((Dimensions.get('window').width) / 5) - 9,
                numColumns: 5
            });
        } else {
            this.setState({
                photoWidth: ((Dimensions.get('window').width) / 1) - 9,
                photoHeight: ((Dimensions.get('window').width) / 2) - 9,
                numColumns: 1
            });
        }

    }


    removeSelected = async () => {

        const dlugosc = this.state.removeArray.length
        this.state.removeArray.map(async (element, index) => {
            await MediaLibrary.deleteAssetsAsync([element.id])
                .then((data) => {
                    if ((index + 1) == dlugosc) {
                        this.refresh()
                    }

                }).catch((error) => {
                    console.log(error.message);
                    alert(error.message);
                })
        })

        this.setState({
            changeState: !this.state.changeState,
            removeArray: []
        });

    }
    uploadSelected = async () => {
        let adressData = JSON.parse(await SecureStore.getItemAsync("adressData"))
        let ip = adressData[0].ip.toString()
        let port = adressData[0].port.toString()

        const data = new FormData();

        this.state.removeArray.map((element) => {
            data.append('photo', {
                uri: element.uri,
                type: 'image/jpeg',
                name: element.name
            });
        })


        try {
            const headers = { "Content-Type": "application/json" }
            const result = await fetch("http://" + ip + ":" + port + "/upload", {
                method: 'POST',
                body: data,

            })
            console.log("eee")
            console.log(result)
            Alert.alert('Alert', 'Photos - files uploaded and saved.')

            this.state.arrayOfPics.map((pic) => {
                pic.toRemove = false
            })
            this.setState({
                changeState: !this.state.changeState,
                removeArray: []
            });


        }
        catch (e) {
            console.log(e)
            Alert.alert('Alert', 'Upload error')
            this.state.arrayOfPics.map((pic) => {
                pic.toRemove = false
            })
            this.setState({
                changeState: !this.state.changeState,
                removeArray: []
            });
        }

    }

    showBigPhoto = (x, y, z) => {
        this.props.navigation.navigate('BigPhotoScreen', { whichPhoto: x, photoId: y, photoname: z, onGoBack: () => this.refresh() })
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.gridContainer}>
                    <TouchableOpacity onPress={this.changeView} style={styles.butContainer}>
                        <Image tintColor="white" style={{ width: 35, height: 35 }} source={require('../icons/grid.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.openCamera} style={styles.butContainer}>
                        <Image tintColor="white" style={{ width: 35, height: 35 }} source={require('../icons/camera.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.removeSelected} style={styles.butContainer}>
                        <Image tintColor="white" style={{ width: 35, height: 35 }} source={require('../icons/remove.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.uploadSelected} style={styles.butContainer}>
                        <Image tintColor="white" style={{ width: 35, height: 35 }} source={require('../icons/upload.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.openSettings} style={styles.butContainer}>
                        <Image tintColor="white" style={{ width: 35, height: 35 }} source={require('../icons/settings.png')} />
                    </TouchableOpacity>

                </View>

                <FlatList
                    data={this.state.arrayOfPics}
                    numColumns={this.state.numColumns}
                    key={this.state.numColumns}
                    renderItem={({ item }) => <OnePhoto uri={item.uri} id={item.id} filename={item.filename} toRemove={item.toRemove} showBigPhoto={this.showBigPhoto} addToRemoveArray={this.addToRemoveArray} width={this.state.photoWidth} height={this.state.photoHeight}></OnePhoto>}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
        alignItems: 'flex-start',
        padding: 3,
        paddingTop: 5,
        backgroundColor: '#1a1f21'
    },
    gridContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: 'auto',
        marginBottom: 6,
        borderBottomWidth: 2,
        borderColor: '#ea1e63'
    },
    text: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    },
    butContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: (width / 8) + 7,
        height: 50,
        marginRight: 15
    }
});

export default PhotosScreen;
