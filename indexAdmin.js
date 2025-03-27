import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
// Eliminamos la importación de NavigationContainer, ya que no se usará aquí.
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import Temperatura from './Consultas/Temperatura';
import Choferes from './Consultas/Conductores';
import Camiones from './Consultas/Camiones';
import Envios from './Consultas/Envios';
import Incidentes from './Consultas/Incidentes';
import Rutas from './Consultas/Rutas';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Pantalla de Inicio con header personalizado
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

// Pantalla de Configuración simplificada
function SettingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Configuración</Text>
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.settingBox}>
          <Icon name="user-cog" size={24} color="#005398" style={styles.settingIcon} />
          <Text style={styles.settingText}>Configurar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingBox}>
          <Icon name="sign-out-alt" size={24} color="#005398" style={styles.settingIcon} />
          <Text style={styles.settingText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Componente personalizado para el Drawer con padding en iconos
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
    </View>
  );
}

// Drawer Navigator para el menú lateral
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
        name="Choferes"
        component={Choferes}
        options={{
          title: 'Consulta de Choferes',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="user-tie" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Camiones"
        component={Camiones}
        options={{
          title: 'Consulta de Camiones',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="truck" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Envios"
        component={Envios}
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
        name="Incidentes"
        component={Incidentes}
        options={{
          title: 'Gestión de Incidentes',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="exclamation-triangle" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Rutas"
        component={Rutas}
        options={{
          title: 'Gestión de Rutas',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="route" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Configuración"
        component={SettingsScreen}
        options={{
          title: 'Configuración',
          drawerIcon: ({ color }) => (
            <View style={styles.drawerIconContainer}>
              <Icon name="cog" size={20} color={color} />
            </View>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// Exportamos directamente el navegador principal (MainDrawer)
// El NavigationContainer se utilizará únicamente en el archivo raíz (por ejemplo, en App.js)
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
});
