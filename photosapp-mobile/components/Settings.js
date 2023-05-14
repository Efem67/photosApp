import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
import * as MediaLibrary from "expo-media-library";
import Dialog from "react-native-dialog";
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';


class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            adressData: this.setAdressInState(),
            ip: '',
            port: '',
            webPort: ''
        };
    }
    dialogCancel = async () => {

        let adressData = JSON.parse(await SecureStore.getItemAsync("adressData"))


        this.setState({
            isVisible: false,
            ip: adressData[0].ip,
            port: adressData[0].port,
            webPort: adressData[0].webPort
        });
    }
    dialogChangeAdress = async () => {

        await SecureStore.setItemAsync("adressData", JSON.stringify(
            [
                {
                    ip: this.state.ip,
                    port: this.state.port,
                    webPort: this.state.webPort

                }
            ]
        ));

        this.setState({
            isVisible: false,
        });
    }
    setAdressInState = async () => {
        let adressData = await SecureStore.getItemAsync("adressData");

        adressData = JSON.parse(await SecureStore.getItemAsync("adressData"))
        this.setState({ adressData: adressData, ip: adressData[0].ip, port: adressData[0].port, webPort: adressData[0].webPort })
        console.log(this.state.adressData[0].ip)
    }

    openBrowserFunc = async () => {
        let result = await WebBrowser.openBrowserAsync('http://' + this.state.ip + ':' + this.state.webPort);
        setResult(result);
    };


    render() {
        let ip;
        let port;
        let webPort;

        try {
            ip = this.state.ip;
            port = this.state.port
            webPort = this.state.webPort
        }
        catch {
            ip = ''
            port = ''
            webPort = ''
        }

        return (

            <View style={styles.container}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={styles.dataViews}>
                        <Text style={styles.text}>Obecnie zapisane IP: {ip}</Text>
                    </View>
                    <View style={styles.dataViews}>
                        <Text style={styles.text}>Obecnie zapisany PORT: {port}</Text>
                    </View>
                    <View style={styles.dataViews}>
                        <Text style={styles.text}>Port do otwarcia browsera: {webPort}</Text>
                    </View>


                    <TouchableOpacity style={styles.buttonViews}>
                        <Text style={styles.buttonText} onPress={() => this.setState({ isVisible: true, })}>Podaj nowe dane</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonViews1}>
                        <Text style={styles.buttonText} onPress={this.openBrowserFunc}>Otwórz webApp</Text>
                    </TouchableOpacity>
                </View>

                <Dialog.Container visible={this.state.isVisible}>
                    <Dialog.Title>Zapis IP, PORTU serwera</Dialog.Title>
                    <Dialog.Description>
                        Czy chcesz zmienić te dane?
                    </Dialog.Description>
                    <Dialog.Input onChangeText={(e) => this.setState({ ip: e })}>{ip}</Dialog.Input>
                    <Dialog.Input onChangeText={(e) => this.setState({ port: e })}>{port}</Dialog.Input>
                    <Dialog.Input onChangeText={(e) => this.setState({ webPort: e })}>{webPort}</Dialog.Input>
                    <Dialog.Button label="Cancel" onPress={this.dialogCancel} />
                    <Dialog.Button label="Save" onPress={this.dialogChangeAdress} />
                </Dialog.Container>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: '#1a1f21',
        flex: 1,
        alignItems: 'center',
        paddingTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    input: {
        borderWidth: 2,
        borderColor: '#ea1e63',
        width: width / 1.3,
        color: 'white',
        padding: 6,
        textAlign: 'center',

    },
    text: {
        fontSize: 20,
        color: 'white'
    },
    dataViews: {
        marginLeft: 80,
        width: width * 0.7,
        textAlign: 'center',
    },
    buttonViews: {
        marginTop: 100,
        width: width,
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'row'

    },
    buttonText: {
        fontSize: 25,
        color: 'white'
    },
    buttonViews1: {
        marginTop: 10,
        width: width,
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'row'
    }
});
export default Settings;
