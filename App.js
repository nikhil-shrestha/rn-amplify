import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';

import { Icon } from 'native-base';
import Amplify from 'aws-amplify';

// Auth stack screen imports
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SignInScreen from './src/screens/SignInScreen';
import ForgetPasswordScreen from './src/screens/ForgetPasswordScreen';

// App stack screen imports
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import config from './aws-exports';

Amplify.configure({
  API: {
    aws_appsync_region: config.graphql.REGION,
    aws_appsync_graphqlEndpoint: config.graphql.URL,
    aws_appsync_authenticationType: config.graphql.AUTHENTICATION_TYPE,
    aws_appsync_apiKey: config.graphql.API_KEY
  },
  Auth: {
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
});

// Configurations and options for the AppTabNavigator
const configurations = {
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-home" style={{ fontSize: 26, color: tintColor }} />
      )
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-person" style={{ fontSize: 26, color: tintColor }} />
      )
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-settings" style={{ fontSize: 26, color: tintColor }} />
      )
    }
  }
};

const options = {
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  animationEnabled: true,
  navigationOptions: {
    tabBarVisible: true
  },
  tabBarOptions: {
    showLabel: true,
    activeTintColor: '#fff',
    inactiveTintColor: '#a8abaf',
    style: {
      backgroundColor: '#667292',
      borderTopWidth: 1,
      borderTopColor: '#ff99', //'#667292',
      paddingBottom: 0
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 12,
      marginTop: 12
    },
    indicatorStyle: {
      height: 0
    },
    showIcon: true
  }
};

// Bottom App tabs
const AppTabNavigator = createMaterialTopTabNavigator(configurations, options);

// Making the common header title dynamic in AppTabNavigator
AppTabNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let headerTitle = routeName;
  return {
    headerTitle
  };
};

const AppStackNavigator = createStackNavigator({
  AppTabNavigator: {
    screen: AppTabNavigator,
    // Set the header icon
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <View style={{ paddingHorizontal: 10 }}>
            <Icon name="md-menu" size={24} />
          </View>
        </TouchableOpacity>
      )
    })
  }
});

// App stack for the drawer
const AppDrawerNavigator = createDrawerNavigator({
  Tabs: AppStackNavigator, // defined above
  Home: HomeScreen,
  Profile: ProfileScreen,
  Settings: SettingsScreen
});

// Auth stack
const AuthStackNavigator = createStackNavigator({
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: () => ({
      title: `Welcome to this App`, // for the header screen
      headerBackTitle: 'Back'
    })
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: () => ({
      title: `Create a new account`
    })
  },
  SignIn: {
    screen: SignInScreen,
    navigationOptions: () => ({
      title: `Log in to your account`
    })
  },
  ForgetPassword: {
    screen: ForgetPasswordScreen,
    navigationOptions: () => ({
      title: `Create a new password`
    })
  }
});

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStackNavigator, // Auth stack
    App: AppDrawerNavigator // the App stack
  })
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
