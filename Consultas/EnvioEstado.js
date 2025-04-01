import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getEstadosEnvio, createEstadoEnvio, updateEstadoEnvio, deleteEstadoEnvio } from '../api/EnvioEstadoApi';
import Icon from 'react-native-vector-icons/FontAwesome5';

const EnvioEstado = () => {
  const [estadosData, setEstadosData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEstado, setNewEstado] = useState({
    num_envio: '',
    num_estado: '',
  });

  const fetchData = async () => {
    try {
      const data = await getEstadosEnvio();
      setEstadosData(data);
    } catch (error) {
      console.error('Error obteniendo datos de estados de envío:', error);
      alert('Error al cargar los estados de envío');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    try {
      if (editingIndex !== null) {
        await updateEstadoEnvio(newEstado.id, newEstado);
        alert('Estado de envío actualizado correctamente');
      } else {
        await createEstadoEnvio(newEstado);
        alert('Estado de envío registrado correctamente');
      }
      fetchData();
      setEditingIndex(null);
      setNewEstado({ 
        num_envio: '', 
        num_estado: '' 
      });
      setIsRegistering(false);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (index) => {
    const estadoToEdit = estadosData[index];
    setNewEstado({
      id: estadoToEdit.id,
      num_envio: estadoToEdit.num_envio?.toString() || '',
      num_estado: estadoToEdit.num_estado?.toString() || '',
    });
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const id = estadosData[index].id;
      await deleteEstadoEnvio(id);
      alert('Estado de envío eliminado correctamente');
      fetchData();
    } catch (error) {
      console.error('Error eliminando estado de envío:', error);
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Estados de Envío</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConsult}
        >
          <Icon name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Consultar Estados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setIsRegistering(true);
            setIsConsulting(false);
            setEditingIndex(null);
            setNewEstado({ 
              num_envio: '', 
              num_estado: '' 
            });
          }}
        >
          <Icon name="plus-circle" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Registrar Nuevo Estado</Text>
        </TouchableOpacity>
      </View>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Historial de Estados</Text>
          {estadosData.map((estado, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="history" size={24} color="#005398" />
                <Text style={styles.cardTitle}>Registro #{estado.id}</Text>
              </View>
              
              <View style={styles.cardBody}>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>N° Envío:</Text> {estado.num_envio}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Estado:</Text> {estado.num_estado}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Fecha:</Text> {new Date(estado.fecha).toLocaleString()}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <TouchableOpacity 
                  style={styles.secondaryButton} 
                  onPress={() => handleEdit(index)}
                >
                  <Icon name="edit" size={16} color="#fff" />
                  <Text style={styles.secondaryButtonText}> Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.secondaryButton, styles.deleteButton]} 
                  onPress={() => handleDelete(index)}
                >
                  <Icon name="trash-alt" size={16} color="#fff" />
                  <Text style={styles.secondaryButtonText}> Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {isRegistering && (
        <View style={styles.form}>
          <Text style={styles.subTitle}>
            {editingIndex !== null ? 'Editar Estado' : 'Registrar Nuevo Estado'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Número de Envío"
            value={newEstado.num_envio}
            onChangeText={(text) => setNewEstado({ ...newEstado, num_envio: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Número de Estado"
            value={newEstado.num_estado}
            onChangeText={(text) => setNewEstado({ ...newEstado, num_estado: text })}
            keyboardType="numeric"
          />
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleRegisterOrUpdate}
          >
            <Text style={styles.primaryButtonText}>
              {editingIndex !== null ? 'Actualizar Estado' : 'Registrar Estado'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

// Puedes reutilizar los mismos estilos del componente Camiones.js
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
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default EnvioEstado;