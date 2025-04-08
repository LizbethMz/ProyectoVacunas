import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../api/UsuariosApi';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Usuarios = () => {
  const [usuariosData, setUsuariosData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newUsuario, setNewUsuario] = useState({
    username: '',
    password: '',
    rol: 'chofer', // Valor por defecto
    num_conductor: '',
  });

  const fetchData = async () => {
    try {
      const data = await getUsuarios();
      setUsuariosData(data);
    } catch (error) {
      console.error('Error obteniendo datos de usuarios:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    if (editingIndex !== null) {
      try {
        await updateUsuario(newUsuario);
        fetchData();
        setEditingIndex(null);
      } catch (error) {
        console.error('Error actualizando usuario:', error);
      }
    } else {
      try {
        await createUsuario(newUsuario);
        fetchData();
      } catch (error) {
        console.error('Error registrando usuario:', error);
      }
    }
    setNewUsuario({ username: '', password: '', rol: 'chofer', num_conductor: '' });
    setIsRegistering(false);
  };

  const handleEdit = (index) => {
    setNewUsuario(usuariosData[index]);
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const id = usuariosData[index].id;
      await deleteUsuario(id);
      fetchData();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Usuarios</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConsult}
        >
          <Icon name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Consultar Información</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setIsRegistering(true);
            setIsConsulting(false);
            setEditingIndex(null);
            setNewUsuario({ username: '', password: '', rol: 'chofer', num_conductor: '' });
          }}
        >
          <Icon name="user-plus" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Registrar Usuario</Text>
        </TouchableOpacity>
      </View>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Usuarios</Text>
          {usuariosData.map((usuario, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="user" size={24} color="#005398" />
                <Text style={styles.cardTitle}>{usuario.username}</Text>
              </View>
              
              <View style={styles.cardBody}>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>ID:</Text> {usuario.id}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Rol:</Text> {usuario.rol === 'admin' ? 'Administrador' : 'Chofer'}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Número Conductor:</Text> {usuario.num_conductor || 'N/A'}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <TouchableOpacity 
                  style={styles.secondaryButton} 
                  onPress={() => handleEdit(index)}
                >
                  <Icon name="edit" size={16} color="#fff" />
                  <Text style={styles.secondaryButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.secondaryButton, styles.deleteButton]} 
                  onPress={() => handleDelete(index)}
                >
                  <Icon name="trash-alt" size={16} color="#fff" />
                  <Text style={styles.secondaryButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {isRegistering && (
        <View style={styles.form}>
          <Text style={styles.subTitle}>{editingIndex !== null ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={newUsuario.username}
            onChangeText={(text) => setNewUsuario({ ...newUsuario, username: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={newUsuario.password}
            onChangeText={(text) => setNewUsuario({ ...newUsuario, password: text })}
            secureTextEntry
          />
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Rol:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={newUsuario.rol}
                onValueChange={(itemValue) => setNewUsuario({ ...newUsuario, rol: itemValue })}
              >
                <Picker.Item label="Administrador" value="admin" />
                <Picker.Item label="Chofer" value="chofer" />
              </Picker>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Número Conductor (opcional)"
            value={newUsuario.num_conductor ? newUsuario.num_conductor.toString() : ''}
            onChangeText={(text) => setNewUsuario({ ...newUsuario, num_conductor: text })}
            keyboardType="numeric"
          />
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleRegisterOrUpdate}
          >
            <Text style={styles.primaryButtonText}>
              {editingIndex !== null ? 'Actualizar Usuario' : 'Registrar Usuario'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#005398',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 10,
  },
  secondaryButton: {
    backgroundColor: '#3498DB',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  card: {
    backgroundColor: '#EAF2F8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D6EAF8',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005398',
    marginLeft: 10,
  },
  cardBody: {
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#005398',
  },
  form: {
    backgroundColor: '#EAF2F8',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D6EAF8',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#005398',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#D6EAF8',
    borderRadius: 5,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Usuarios;