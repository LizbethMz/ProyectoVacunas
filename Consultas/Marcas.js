import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getMarcas, createMarca, updateMarca, deleteMarca, checkCodigoMarcaExistente } from '../api/MarcasApi';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Mensaje from './Mensaje';

const Marcas = () => {
  const [marcasData, setMarcasData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newMarca, setNewMarca] = useState({
    codigo: '',
    nombre: '',
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const mostrarMensaje = (texto, tipo = 'exito') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 5000);
  };

  const fetchData = async () => {
    try {
      const data = await getMarcas();
      setMarcasData(data);
    } catch (error) {
      console.error('Error obteniendo datos de marcas:', error);
      mostrarMensaje('Error al cargar las marcas', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    try {
      // Validar campos vacíos
      if (!newMarca.codigo || !newMarca.nombre) {
        mostrarMensaje('Todos los campos son requeridos', 'error');
        return;
      }

      // Validar formato numérico
      const codigo = parseInt(newMarca.codigo);
      if (isNaN(codigo)) {
        mostrarMensaje('El código debe ser un valor numérico', 'error');
        return;
      }

      // Solo verificar si es nuevo registro (no en edición)
      if (editingIndex === null) {
        const existe = await checkCodigoMarcaExistente(codigo);
        if (existe) {
          mostrarMensaje('El código de marca ya está registrado', 'error');
          return;
        }
      }

      if (editingIndex !== null) {
        await updateMarca(newMarca);
        mostrarMensaje('Marca actualizada exitosamente', 'exito');
        setEditingIndex(null);
      } else {
        await createMarca({ ...newMarca, codigo });
        mostrarMensaje('Marca creada exitosamente', 'exito');
      }

      fetchData();
      setNewMarca({ codigo: '', nombre: '' });
      setIsRegistering(false);
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje(error.message || 'Ocurrió un error al procesar la solicitud', 'error');
    }
  };

  const handleEdit = (index) => {
    setNewMarca(marcasData[index]);
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const codigo = marcasData[index].codigo;
      await deleteMarca(codigo);
      mostrarMensaje('Marca eliminada exitosamente', 'exito');
      fetchData();
    } catch (error) {
      console.error('Error eliminando marca:', error);
      mostrarMensaje('Error al eliminar marca', 'error');
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Marcas</Text>

      <Mensaje texto={mensaje.texto} tipo={mensaje.tipo} />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConsult}
        >
          <Icon name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Consultar Marcas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setIsRegistering(true);
            setIsConsulting(false);
            setEditingIndex(null);
            setNewMarca({ codigo: '', nombre: '' });
          }}
        >
          <Icon name="plus" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Registrar Nueva Marca</Text>
        </TouchableOpacity>
      </View>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Marcas</Text>
          {marcasData.map((marca, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="tag" size={24} color="#005398" />
                <Text style={styles.cardTitle}>Marca #{marca.codigo}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Nombre:</Text> {marca.nombre}
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
            {editingIndex !== null ? 'Editar Marca' : 'Registrar Nueva Marca'}
          </Text>

          <TextInput
            style={[styles.input, editingIndex !== null && styles.disabledInput]}
            placeholder="Código"
            value={newMarca.codigo}
            onChangeText={(text) => editingIndex === null && setNewMarca({ ...newMarca, codigo: text })}
            keyboardType="numeric"
            editable={editingIndex === null}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={newMarca.nombre}
            onChangeText={(text) => setNewMarca({ ...newMarca, nombre: text })}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRegisterOrUpdate}
          >
            <Text style={styles.primaryButtonText}>
              {editingIndex !== null ? 'Actualizar Marca' : 'Registrar Marca'}
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

export default Marcas;