import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Picker } from 'react-native';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../api/UsuariosApi';

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

      <TouchableOpacity
        style={styles.button}
        onPress={handleConsult}
      >
        <Text style={styles.buttonText}>Consultar Información</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsRegistering(true);
          setIsConsulting(false);
          setEditingIndex(null);
          setNewUsuario({ username: '', password: '', rol: 'chofer', num_conductor: '' });
        }}
      >
        <Text style={styles.buttonText}>Registrar Usuario</Text>
      </TouchableOpacity>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Usuarios</Text>
          {usuariosData.map((usuario, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>
                <Text style={styles.label}>ID:</Text> {usuario.id}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Username:</Text> {usuario.username}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Rol:</Text> {usuario.rol === 'admin' ? 'Administrador' : 'Chofer'}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Número Conductor:</Text> {usuario.num_conductor || 'N/A'}
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(index)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
                  <Text style={styles.buttonText}>Eliminar</Text>
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
          
          {/* Selector de Rol */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Rol:</Text>
            <View style={styles.picker}>
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
          <Button 
            title={editingIndex !== null ? 'Actualizar' : 'Registrar'} 
            onPress={handleRegisterOrUpdate} 
            color="#005398"
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'rgb(230, 242, 255)',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 16,
    color: '#005398',
  },
  label: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'rgb(0, 64, 128)',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#F0A500',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#D7263D',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  form: {
    width: '90%',
    padding: 20,
    backgroundColor: 'rgb(230, 242, 255)',
    borderRadius: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#005398',
    marginRight: 10,
    fontWeight: 'bold',
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    height: 50,
    justifyContent: 'center',
  },
});

export default Usuarios;