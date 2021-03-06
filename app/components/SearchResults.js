import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  ListView,
  Image,
} from 'react-native';

export class SearchResults extends Component {

  constructor(props) {
    super(props);
    var listings = this.props.location.query.listings;
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.guid !== r2.guid});
    this.state = {
      dataSource: dataSource.cloneWithRows(listings)
    };
  }

  renderRow(rowData, sectionID, rowID) {
    var price = rowData.price_formatted.split(' ')[0];

    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData.guid)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: rowData.img_url }} />
            <View  style={styles.textContainer}>
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.title}
                    numberOfLines={1}>{rowData.title}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  rowPressed(propertyGuid) {
    var property = this.props.location.query.listings.filter(prop => prop.guid === propertyGuid)[0];
    this.context.router.transitionTo({
      pathname: "/view",
      query: { property: property, listings: this.props.location.query.listings }
    });
  }
  onBackPressed() {
    this.context.router.transitionTo({
     pathname: '/',
    })
  }

  render() {
    return (
      <View>
      <TouchableHighlight
          onPress={this.onBackPressed.bind(this)}
          style={styles.NavBar}
          >
          <Text
          style={styles.routeLink}
          >
          Back
          </Text>
          </TouchableHighlight>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  NavBar: {
    padding: 22,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
  },
  routeLink: {
    color: 'white',
    marginBottom: -20,
    marginLeft: 5,
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

SearchResults.contextTypes = {
  router: React.PropTypes.object
};
