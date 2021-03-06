import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image,
} from 'react-native';


function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber
  };
  data[key] = value;

  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'http://api.nestoria.co.uk/api?' + querystring;
}

export class SearchPage extends Component {

  contextTypes: {
    router: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: ''
    };
  }

  _executeQuery(query) {
    console.log(query);
    this.setState({ isLoading: true });
    fetch(query)
    .then(response => response.json())
    .then(json => this._handleResponse(json.response))
    .catch(error =>
       this.setState({
        isLoading: false,
        message: 'Something bad happened ' + error
     }));
  }

  _handleResponse(response) {
    this.setState({ isLoading: false , message: '' });
    if (response.application_response_code.substr(0, 1) === '1') {
      this.context.router.transitionTo({
       pathname: '/results',
       query: { listings: response.listings }
      })
      } else {
        this.setState({ message: 'Location not recognized; please try again.'});
    }
  }

  onSearchPressed() {
    var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  }


  render() {
    console.log('SearchPage.render');
    var spinner = this.state.isLoading ?
    ( <ActivityIndicator size='large'/> ) :
    ( <View/>);
    return (
      <View>
      <Text style={styles.NavBar}>
        React Native on Web Demo
      </Text>
      <View style={styles.container}>

        <Text style={styles.description}>
          Search for houses to buy!
        </Text>
        <Text style={styles.description}>
          Search by place-name, postcode or search near your location.
        </Text>
        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChangeText={(searchString) => this.setState({searchString})}
            placeholder='Search via name or postcode'/>
          <TouchableHighlight
              style={styles.button}
              onPress={this.onSearchPressed.bind(this)}
              underlayColor='#99d9f4'>
            <Text
              style={styles.buttonText}
            >Go</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight style={styles.button}
            underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Location</Text>
        </TouchableHighlight>
        <Image source={require('../assets/house.png')} style={styles.image}/>
        <Text style={styles.description}>{this.state.message}</Text>
        {spinner}
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    marginRight: 5,
    marginBottom: 10,
    flex: 4,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138,
    alignSelf: 'center'
  },
  NavBar: {
    marginBottom: 20,
    paddingTop: 20,
    fontSize: 22,
    backgroundColor: '#48BBEC',
    textAlign: 'center',
    alignSelf: 'stretch',
    color: 'white'
  },
});

SearchPage.contextTypes = {
  router: React.PropTypes.object
};
