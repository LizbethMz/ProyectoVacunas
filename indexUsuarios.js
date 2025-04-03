import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import EnviosAsignados from './ConsultasUsuarios/EnviosAsignados';
import MiCamion from './ConsultasUsuarios/MiCamion';
import ReportarIncidente from './ConsultasUsuarios/ReportarIncidente';
import MiRuta from './ConsultasUsuarios/MiRuta';
import CambiarEstado from './ConsultasUsuarios/CambiarEstado';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeScreenUsuario({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido Conductor</Text>
      
      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('EnviosAsignados')}
      >
        <Icon name="shipping-fast" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Mis Envíos</Text>
        <Text style={styles.menuCardText}>Ver envíos asignados</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('MiCamion')}
      >
        <Icon name="truck" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Mi Camión</Text>
        <Text style={styles.menuCardText}>Información del vehículo asignado</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('MiRuta')}
      >
        <Icon name="route" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Mi Ruta</Text>
        <Text style={styles.menuCardText}>Ver detalles de la ruta asignada</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function CustomDrawerContent(props) {
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>TransportApp Conductor</Text>
      </View>
      <DrawerItemList
        {...props}
        itemStyle={styles.drawerItem}
        iconContainerStyle={styles.drawerIconContainer}
      />
      <TouchableOpacity
        style={styles.logoutButtonBlue}
        onPress={() => {
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
          });
        }}
      >
        <View style={styles.logoutButtonContent}>
          <Icon name="sign-out-alt" size={20} color="#003B75" />
          <Text style={styles.logoutButtonTextBlue}>Cerrar sesión</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function MainDrawerUsuario() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerStyle: { backgroundColor: 'rgb(230, 243, 254)' },
        drawerActiveTintColor: '#005398',
        drawerInactiveTintColor: '#003B75',
        drawerActiveBackgroundColor: 'rgba(0, 83, 152, 0.1)',
        headerStyle: { backgroundColor: 'rgb(189, 211, 228)' },
        headerTitleStyle: { color: '#005398', fontWeight: 'bold' },
        drawerLabelStyle: { marginLeft: -15, fontSize: 16 },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={styles.headerMenuButton}
          >
            <Icon name="bars" size={24} color="#005398" />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="HomeUsuario"
        component={HomeScreenUsuario}
        options={{
          title: 'Inicio',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="home" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="EnviosAsignados"
        component={EnviosAsignados}
        options={{
          title: 'Mis Envíos',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="shipping-fast" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="MiCamion"
        component={MiCamion}
        options={{
          title: 'Mi Camión',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="truck" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="ReportarIncidente"
        component={ReportarIncidente}
        options={{
          title: 'Reportar Incidente',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="exclamation-triangle" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="MiRuta"
        component={MiRuta}
        options={{
          title: 'Mi Ruta',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="route" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="CambiarEstado"
        component={CambiarEstado}
        options={{
          title: 'Cambiar Estado',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="exchange-alt" size={20} color={color} />
            </View>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default MainDrawerUsuario;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 30,
  },
  menuCard: {
    backgroundColor: 'rgb(230, 242, 255)',
    width: '100%',
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginVertical: 10,
  },
  menuCardText: {
    fontSize: 14,
    color: '#003B75',
    textAlign: 'center',
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: 'rgb(230, 243, 254)',
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: 'rgb(189, 211, 228)',
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
  },
  drawerItem: {
    marginVertical: 5,
  },
  drawerIconContainer: {
    padding: 10,
  },
  headerMenuButton: {
    marginLeft: 15,
    padding: 10,
  },
  logoutButtonBlue: {
    marginTop: 'auto',
    marginBottom: 20,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonTextBlue: {
    marginLeft: 15,
    fontSize: 16,
    color: '#003B75',
    fontWeight: 'bold',
  },
});