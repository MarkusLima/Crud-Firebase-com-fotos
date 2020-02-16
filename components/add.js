import React from 'react';
import { StyleSheet, ActivityIndicator, View, TextInput, Image, Text, Button, Alert} from 'react-native';
import firebase from '../Firebase';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

export default class AddBoardScreen extends React.Component {
    static navigationOptions = {
        title: 'Adicionar Post',
    };
    constructor() {
        super();
        this.ref = firebase.firestore().collection('boards');
        this.state = {
            title: '',
            description: '',
            author: '',
            image: null,
            referenceImage: null,
            random: null,
            isLoading: false,
        };
        console.disableYellowBox = true;
    }

    componentDidMount=()=> {
        const randomValue = Math.floor(Math.random() * 6553601) - 3276818;
        this.setState({random: randomValue})
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                Alert.alert('Desculpe, você não tem permissão para utilizar a câmera! Configure as permissões do seu aparelho.');
            }
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 6],
            quality: 1
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri });
            this.uploadImage(result.uri, this.state.random)  
        }
    }

    uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        this.setState({referenceImage: imageName})
        var ref = firebase.storage().ref().child("images/" + imageName);
        return ref.put(blob);
      }

    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }

    saveBoard() {
        this.setState({isLoading: true });
        this.ref.add({
            title: this.state.title,
            description: this.state.description,
            author: this.state.author,
            image: 'https://firebasestorage.googleapis.com/v0/b/chat-2f848.appspot.com/o/images%2F'+this.state.referenceImage+'?alt=media&token=49835da1-cff2-4ae0-88bb-fee4be846093'
            
        }).then((docRef) => { this.setState({
                title: '',
                description: '',
                author: '',
                image: '',
                isLoading: false,
            });
            this.props.navigation.goBack();
        })
            .catch((error) => {
                Alert.alert("Erro na edição do post ", error);
                this.setState({isLoading: false });
            });
    }

    render() {
        let { image } = this.state;    
            if (this.state.isLoading) {
                return (
                    <View style={styles.activity}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text>Carregando...</Text>
                    </View>
                )
            }
            return (
                <View style={styles.container}>

                    <View>
                        <Button title="Selecionar Imagem" onPress={this._pickImage} />
                        <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
                    </View>
    
                    <View style={styles.subContainer}>
                        <TextInput style={styles.imput}
                            placeholder={'Title'}
                            value={this.state.title}
                            onChangeText={(text) => this.updateTextInput(text, 'title')}
                        />
                    </View>

                    <View style={styles.subContainer}>
                        <TextInput style={styles.imput}
                            numberOfLines={4}
                            placeholder={'Description'}
                            value={this.state.description}
                            onChangeText={(text) => this.updateTextInput(text, 'description')}
                        />
                    </View>

                    <View style={styles.subContainer}>
                        <TextInput style={styles.imput}
                            placeholder={'Author'}
                            value={this.state.author}
                            onChangeText={(text) => this.updateTextInput(text, 'author')}
                        />
                    </View>

                    <View>
                        <Button
                            leftIcon={{ name: 'save' }}
                            title='Salvar'
                            onPress={() => this.saveBoard()} />
                    </View>
                </View>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    subContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    activity: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imput:{

        height: 200,
        width: 100

    }
})
