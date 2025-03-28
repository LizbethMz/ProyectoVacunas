import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const GestionMenu = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color="#005398" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Módulo de Gestión</Text>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => navigation.navigate('Usuarios')} 
        >
          <View style={styles.optionContent}>
            <Icon name="users-cog" size={40} color="#005398" style={styles.optionIcon} />
            <Text style={styles.optionText}>Gestión de Usuarios</Text>
            <Text style={styles.optionDescription}>
              Administra los usuarios del sistema (crear, editar, eliminar)
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => navigation.navigate('Choferes')} 
        >
          <View style={styles.optionContent}>
            <Icon name="user-tie" size={40} color="#005398" style={styles.optionIcon} />
            <Text style={styles.optionText}>Gestión de Choferes</Text>
            <Text style={styles.optionDescription}>
              Administra la información de los conductores
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 1,
    padding: 10,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60, // Añadido espacio para la flecha
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionCard: {
    backgroundColor: 'rgb(230, 242, 255)',
    width: '90%',
    borderRadius: 10,
    padding: 25,
    marginBottom: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  optionContent: {
    alignItems: 'center',
  },
  optionIcon: {
    marginBottom: 15,
  },
  optionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 10,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    color: '#003B75',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default GestionMenu;