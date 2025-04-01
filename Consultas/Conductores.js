import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getConductores, createConductor, updateConductor, deleteConductor, checkNumeroConductorExistente } from '../api/ConductoresApi';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Mensaje from './Mensaje';

const Conductores = () => {
  const [conductoresData, setConductoresData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newConductor, setNewConductor] = useState({
    numero: '',
    nombre_pila: '',
    apellidoP: '',
    apellidoM: '',
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const mostrarMensaje = (texto, tipo = 'exito') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 5000);
  };

  const fetchData = async () => {
    try {
      const data = await getConductores();
      setConductoresData(data);
    } catch (error) {
      console.error('Error obteniendo datos de conductores:', error);
      mostrarMensaje('Error al cargar los conductores', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    try {
      // Validar campos vacíos
      if (!newConductor.numero || !newConductor.nombre_pila || !newConductor.apellidoP || !newConductor.apellidoM) {
        mostrarMensaje('Todos los campos son requeridos', 'error');
        return;
      }

      // Validar formato numérico
      const numero = parseInt(newConductor.numero);
      if (isNaN(numero)) {
        mostrarMensaje('El número debe ser un valor numérico', 'error');
        return;
      }

      // Solo verificar si es nuevo registro (no en edición)
      if (editingIndex === null) {
        const existe = await checkNumeroConductorExistente(numero);
        if (existe) {
          mostrarMensaje('El número de conductor ya está registrado', 'error');
          return;
        }
      }

      if (editingIndex !== null) {
        await updateConductor(newConductor);
        mostrarMensaje('Conductor actualizado exitosamente', 'exito');
        setEditingIndex(null);
      } else {
        await createConductor({ ...newConductor, numero });
        mostrarMensaje('Conductor creado exitosamente', 'exito');
      }

      fetchData();
      setNewConductor({ numero: '', nombre_pila: '', apellidoP: '', apellidoM: '' });
      setIsRegistering(false);
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje(error.message || 'Ocurrió un error al procesar la solicitud', 'error');
    }
  };

  const handleEdit = (index) => {
    setNewConductor(conductoresData[index]);
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const numero = conductoresData[index].numero;
      await deleteConductor(numero);
      mostrarMensaje('Conductor eliminado exitosamente', 'exito');
      fetchData();
    } catch (error) {
      console.error('Error eliminando conductor:', error);
      mostrarMensaje('Error al eliminar conductor', 'error');
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Conductores</Text>

      <Mensaje texto={mensaje.texto} tipo={mensaje.tipo} />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConsult}
        >
          <Icon name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Consultar Conductores</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setIsRegistering(true);
            setIsConsulting(false);
            setEditingIndex(null);
            setNewConductor({ numero: '', nombre_pila: '', apellidoP: '', apellidoM: '' });
          }}
        >
          <Icon name="user-plus" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Registrar Nuevo Conductor</Text>
        </TouchableOpacity>
      </View>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Conductores</Text>
          {conductoresData.map((conductor, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="user-tie" size={24} color="#005398" />
                <Text style={styles.cardTitle}>Conductor #{conductor.numero}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Nombre:</Text> {conductor.nombre_pila}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Apellido Paterno:</Text> {conductor.apellidoP}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Apellido Materno:</Text> {conductor.apellidoM}
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
            {editingIndex !== null ? 'Editar Conductor' : 'Registrar Nuevo Conductor'}
          </Text>

          <TextInput
            style={[styles.input, editingIndex !== null && styles.disabledInput]}
            placeholder="Número"
            value={newConductor.numero}
            onChangeText={(text) => editingIndex === null && setNewConductor({ ...newConductor, numero: text })}
            keyboardType="numeric"
            editable={editingIndex === null}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={newConductor.nombre_pila}
            onChangeText={(text) => setNewConductor({ ...newConductor, nombre_pila: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido Paterno"
            value={newConductor.apellidoP}
            onChangeText={(text) => setNewConductor({ ...newConductor, apellidoP: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido Materno"
            value={newConductor.apellidoM}
            onChangeText={(text) => setNewConductor({ ...newConductor, apellidoM: text })}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRegisterOrUpdate}
          >
            <Text style={styles.primaryButtonText}>
              {editingIndex !== null ? 'Actualizar Conductor' : 'Registrar Conductor'}
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
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
    textAlign: 'center',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#888',
  },
});

export default Conductores;