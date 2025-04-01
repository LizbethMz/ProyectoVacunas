import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import Temperatura from './Consultas/Temperatura';
import Choferes from './Consultas/Conductores';
import Camiones from './Consultas/Camiones';
import Envios from './Consultas/Envios';
import Incidentes from './Consultas/Incidentes';
import Rutas from './Consultas/Rutas';
import Usuarios from './Consultas/Usuarios';
import Sucursales from './Consultas/Sucursales';
import Farmaceuticas from './Consultas/Farmaceuticas';
import Plantas from './Consultas/Plantas';
import Laboratorios from './Consultas/Laboratorios';
import AsignacionConductores from './Consultas/AsignacionConductores';
import Paquetes from './Consultas/Paquetes';
import RegistroCarga from './Consultas/RegistroCarga';
import Marcas from './Consultas/Marcas';
import Modelos from './Consultas/Modelos';
import EnvioEstado from './Consultas/EnvioEstado';
import Mensaje from './Consultas/Mensaje';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function TransporteSubMenu({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.menuContainer}>
      <View style={styles.subMenuHeader}>
        <Text style={styles.menuTitle}>Transporte</Text>
      </View>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Camiones')}
      >
        <Icon name="truck" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Camiones</Text>
        <Text style={styles.menuCardText}>Administra la flota de camiones</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('RegistroCarga')}
      >
        <Icon name="weight" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Registro de Carga</Text>
        <Text style={styles.menuCardText}>Gestiona los registros de carga</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Marcas')}
      >
        <Icon name="tag" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Marcas</Text>
        <Text style={styles.menuCardText}>Administra las marcas de camiones</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Modelos')}
      >
        <Icon name="car-alt" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Modelos</Text>
        <Text style={styles.menuCardText}>Gestiona los modelos de camiones</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function GestionUsuariosMenu({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.menuContainer}>
      <Text style={styles.menuTitle}>Módulos de Gestión</Text>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Usuarios')}
      >
        <Icon name="users-cog" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Gestión de Usuarios</Text>
        <Text style={styles.menuCardText}>Administra usuarios del sistema</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Choferes')}
      >
        <Icon name="user-tie" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Gestión de Choferes</Text>
        <Text style={styles.menuCardText}>Administra información de conductores</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function GestionTransporteMenu({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.menuContainer}>
      <Text style={styles.menuTitle}>Gestión de Transporte</Text>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('TransporteSubMenu')}
      >
        <Icon name="truck" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Camiones</Text>
        <Text style={styles.menuCardText}>Administra la flota de camiones</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('AsignacionConductores')}
      >
        <Icon name="user-tag" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Asignación de Conductores</Text>
        <Text style={styles.menuCardText}>Asigna conductores a camiones</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Rutas')}
      >
        <Icon name="route" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Rutas</Text>
        <Text style={styles.menuCardText}>Administra las rutas de transporte</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Incidentes')}
      >
        <Icon name="exclamation-triangle" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Incidentes</Text>
        <Text style={styles.menuCardText}>Registra y gestiona incidentes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function GestionEnviosMenu({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.menuContainer}>
      <Text style={styles.menuTitle}>Gestión de Envíos</Text>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Envios')}
      >
        <Icon name="shipping-fast" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Envios</Text>
        <Text style={styles.menuCardText}>Administra los envíos programados</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Paquetes')}
      >
        <Icon name="box" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Paquetes</Text>
        <Text style={styles.menuCardText}>Gestiona los paquetes de los envíos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('EnvioEstado')}
      >
        <Icon name="check-square" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Estados del Envio</Text>
        <Text style={styles.menuCardText}>Gestiona los estados de los envíos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function GestionFarmaciasMenu({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.menuContainer}>
      <Text style={styles.menuTitle}>Gestión de Farmacias</Text>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Sucursales')}
      >
        <Icon name="store" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Sucursales</Text>
        <Text style={styles.menuCardText}>Administra las sucursales del sistema</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Farmaceuticas')}
      >
        <Icon name="prescription-bottle-alt" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Farmacéuticas</Text>
        <Text style={styles.menuCardText}>Administra las farmacéuticas asociadas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function GestionPlantasLaboratoriosMenu({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.menuContainer}>
      <Text style={styles.menuTitle}>Gestión de Plantas y Laboratorios</Text>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Plantas')}
      >
        <Icon name="leaf" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Plantas</Text>
        <Text style={styles.menuCardText}>Administra las plantas de producción</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Laboratorios')}
      >
        <Icon name="flask" size={40} color="#005398" />
        <Text style={styles.menuCardTitle}>Laboratorios</Text>
        <Text style={styles.menuCardText}>Administra los laboratorios asociados</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard General</Text>

      {/* Estado General */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado General</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Icon name="truck" size={30} color="#003B75" style={styles.icon} />
            <Text style={styles.infoText}>Camiones Activos</Text>
            <Text style={styles.highlight}>12</Text>
          </View>
          <View style={styles.infoCard}>
            <Icon name="box" size={30} color="#003B75" style={styles.icon} />
            <Text style={styles.infoText}>Envíos en Curso</Text>
            <Text style={styles.highlight}>8</Text>
          </View>
          <View style={styles.infoCard}>
            <Icon name="exclamation-circle" size={30} color="#003B75" style={styles.icon} />
            <Text style={styles.infoText}>Incidentes</Text>
            <Text style={styles.highlight}>2</Text>
          </View>
        </View>
      </View>

      {/* Temperatura en Tiempo Real */}
      <View style={styles.tempContainer}>
        <Text style={styles.sectionTitle}>Temperaturas Activas</Text>
        <View style={styles.tempCard}>
          <View style={styles.tempLeft}>
            <Text style={styles.tempText}>2°C</Text>
          </View>
          <View style={styles.tempRight}>
            <Text style={styles.tempTitle}>Camión 101</Text>
            <Text style={styles.statusOK}>Estable</Text>
          </View>
        </View>

        <View style={styles.tempCard}>
          <View style={styles.tempLeft}>
            <Text style={styles.tempText}>8°C</Text>
          </View>
          <View style={styles.tempRight}>
            <Text style={styles.tempTitle}>Camión 102</Text>
            <Text style={styles.statusWarning}>¡Atención!</Text>
          </View>
        </View>

        <View style={styles.tempCard}>
          <View style={styles.tempLeft}>
            <Text style={styles.tempText}>4°C</Text>
          </View>
          <View style={styles.tempRight}>
            <Text style={styles.tempTitle}>Camión 103</Text>
            <Text style={styles.statusOK}>Estable</Text>
          </View>
        </View>
      </View>

      {/* Próximos Envíos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos Envíos</Text>
        <View style={styles.envioCard}>
          <View style={styles.envioLeft}>
            <Icon name="shipping-fast" style={styles.iconShipping} />
          </View>
          <View style={styles.envioCenter}>
            <Text style={styles.envioText}>
              Planta MedicPro <Icon name="angle-right" style={styles.iconShipping} /> Clinica 130
            </Text>
          </View>
          <View style={styles.envioRight} />
        </View>
        <View style={styles.envioCard}>
          <View style={styles.envioLeft}>
            <Icon name="shipping-fast" style={styles.iconShipping} />
          </View>
          <View style={styles.envioCenter}>
            <Text style={styles.envioText}>
              Farmaceutica Luna <Icon name="angle-right" style={styles.iconShipping} /> Clinica General 23
            </Text>
          </View>
          <View style={styles.envioRight} />
        </View>
      </View>
    </ScrollView>
  );
}

function CustomDrawerContent(props) {
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>TransportApp</Text>
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

function MainDrawer() {
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
        name="Home"
        component={HomeScreen}
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
        name="Temperatura"
        component={Temperatura}
        options={{
          title: 'Consulta de Temperatura',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="thermometer-half" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="GestionUsuarios"
        component={GestionUsuariosMenu}
        options={{
          title: 'Gestión de Usuarios',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="users-cog" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="GestionTransporte"
        component={GestionTransporteMenu}
        options={{
          title: 'Transporte',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="truck" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="TransporteSubMenu"
        component={TransporteSubMenu}
        options={{
          title: 'Transporte',
          drawerItemStyle: { display: 'none' },
          headerLeft: ({ tintColor }) => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.headerMenuButton}
            >
              <Icon name="arrow-left" size={24} color={tintColor} />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen
        name="GestionEnvios"
        component={GestionEnviosMenu}
        options={{
          title: 'Gestión de Envíos',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="shipping-fast" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="GestionFarmacias"
        component={GestionFarmaciasMenu}
        options={{
          title: 'Gestión de Farmacias',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="clinic-medical" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="GestionPlantasLaboratorios"
        component={GestionPlantasLaboratoriosMenu}
        options={{
          title: 'Plantas y Laboratorios',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="industry" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Usuarios"
        component={Usuarios}
        options={{
          title: 'Admin. Usuarios',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Choferes"
        component={Choferes}
        options={{
          title: 'Admin. Choferes',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Sucursales"
        component={Sucursales}
        options={{
          title: 'Admin. Sucursales',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Farmaceuticas"
        component={Farmaceuticas}
        options={{
          title: 'Admin. Farmacéuticas',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Plantas"
        component={Plantas}
        options={{
          title: 'Admin. Plantas',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Laboratorios"
        component={Laboratorios}
        options={{
          title: 'Admin. Laboratorios',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Camiones"
        component={Camiones}
        options={{
          title: 'Admin. Camiones',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="RegistroCarga"
        component={RegistroCarga}
        options={{
          title: 'Registro de Carga',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Marcas"
        component={Marcas}
        options={{
          title: 'Admin. Marcas',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Modelos"
        component={Modelos}
        options={{
          title: 'Admin. Modelos',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="AsignacionConductores"
        component={AsignacionConductores}
        options={{
          title: 'Admin. Asignación Conductores',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Envios"
        component={Envios}
        options={{
          title: 'Admin. Envíos',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="EnvioEstado"
        component={EnvioEstado}
        options={{
          title: 'Admin. EnvioEstado',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Incidentes"
        component={Incidentes}
        options={{
          title: 'Admin. Incidentes',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Rutas"
        component={Rutas}
        options={{
          title: 'Admin. Rutas',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Paquetes"
        component={Paquetes}
        options={{
          title: 'Admin. Paquetes',
          drawerItemStyle: { display: 'none' }
        }}
      />
    </Drawer.Navigator>
  );
}

export default MainDrawer;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003B75',
    marginBottom: 10,
  },
  tempContainer: {
    width: '100%',
  },
  tempCard: {
    flexDirection: 'row',
    backgroundColor: 'rgb(249, 249, 255)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: 'center',
  },
  tempLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#005398',
  },
  tempRight: {
    flex: 2,
    paddingLeft: 10,
  },
  tempTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003B75',
    marginBottom: 5,
  },
  statusOK: {
    fontSize: 14,
    color: '#228B22',
    fontWeight: 'bold',
  },
  statusWarning: {
    fontSize: 14,
    color: '#FF4500',
    fontWeight: 'bold',
  },
  envioCard: {
    flexDirection: 'row',
    backgroundColor: 'rgb(210, 222, 231)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: 'center',
    height: 80,
  },
  envioLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  envioCenter: {
    flex: 2,
    paddingLeft: 10,
  },
  envioRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconShipping: {
    color: '#005398',
    fontSize: 30,
  },
  envioText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003B75',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  infoCard: {
    backgroundColor: '#DBEDFC',
    width: '30%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  icon: {
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#003B75',
    textAlign: 'center',
    marginBottom: 5,
  },
  highlight: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#005398',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    padding: 20,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  settingBox: {
    backgroundColor: 'rgb(199, 223, 243)',
    width: '45%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  settingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#005398',
    fontWeight: 'bold',
    marginTop: 10,
  },
  settingIcon: {
    marginBottom: 5,
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
  menuContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  menuTitle: {
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