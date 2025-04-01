import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getModelos, createModelo, updateModelo, deleteModelo, checkCodigoModeloExistente, getMarcas } from '../api/ModelosApi';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Mensaje from './Mensaje';

const Modelos = () => {
  const [modelosData, setModelosData] = useState([]);
  const [marcasData, setMarcasData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newModelo, setNewModelo] = useState({
    codigo: '',
    nombre: '',
    year: '',
    cod_marca: ''
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const mostrarMensaje = (texto, tipo = 'exito') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 5000);
  };

  const fetchData = async () => {
    try {
      const data = await getModelos();
      setModelosData(data);
    } catch (error) {
      console.error('Error obteniendo datos de modelos:', error);
      mostrarMensaje('Error al cargar los modelos', 'error');
    }
  };

  const fetchMarcas = async () => {
    try {
      const data = await getMarcas();
      setMarcasData(data);
    } catch (error) {
      console.error('Error obteniendo marcas:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMarcas();
  }, []);

  const handleRegisterOrUpdate = async () => {
    try {
      // Validar campos vacíos
      if (!newModelo.codigo || !newModelo.nombre || !newModelo.year || !newModelo.cod_marca) {
        mostrarMensaje('Todos los campos son requeridos', 'error');
        return;
      }

      // Validar formato numérico
      const codigo = parseInt(newModelo.codigo);
      const year = parseInt(newModelo.year);
      const cod_marca = parseInt(newModelo.cod_marca);
      
      if (isNaN(codigo) || isNaN(year) || isNaN(cod_marca)) {
        mostrarMensaje('Los campos código, año y código de marca deben ser numéricos', 'error');
        return;
      }

      // Solo verificar si es nuevo registro (no en edición)
      if (editingIndex === null) {
        const existe = await checkCodigoModeloExistente(codigo);
        if (existe) {
          mostrarMensaje('El código de modelo ya está registrado', 'error');
          return;
        }
      }

      const modeloData = {
        codigo,
        nombre: newModelo.nombre,
        year,
        cod_marca
      };

      if (editingIndex !== null) {
        await updateModelo(modeloData);
        mostrarMensaje('Modelo actualizado exitosamente', 'exito');
        setEditingIndex(null);
      } else {
        await createModelo(modeloData);
        mostrarMensaje('Modelo creado exitosamente', 'exito');
      }

      fetchData();
      setNewModelo({ codigo: '', nombre: '', year: '', cod_marca: '' });
      setIsRegistering(false);
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje(error.message || 'Ocurrió un error al procesar la solicitud', 'error');
    }
  };

  const handleEdit = (index) => {
    setNewModelo(modelosData[index]);
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const codigo = modelosData[index].codigo;
      await deleteModelo(codigo);
      mostrarMensaje('Modelo eliminado exitosamente', 'exito');
      fetchData();
    } catch (error) {
      console.error('Error eliminando modelo:', error);
      mostrarMensaje('Error al eliminar modelo', 'error');
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Modelos</Text>

      <Mensaje texto={mensaje.texto} tipo={mensaje.tipo} />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConsult}
        >
          <Icon name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Consultar Modelos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setIsRegistering(true);
            setIsConsulting(false);
            setEditingIndex(null);
            setNewModelo({ codigo: '', nombre: '', year: '', cod_marca: '' });
          }}
        >
          <Icon name="plus-circle" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Registrar Nuevo Modelo</Text>
        </TouchableOpacity>
      </View>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Modelos</Text>
          {modelosData.map((modelo, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="car" size={24} color="#005398" />
                <Text style={styles.cardTitle}>Modelo #{modelo.codigo}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Nombre:</Text> {modelo.nombre}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Año:</Text> {modelo.year}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Código de Marca:</Text> {modelo.cod_marca}
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
            {editingIndex !== null ? 'Editar Modelo' : 'Registrar Nuevo Modelo'}
          </Text>

          <TextInput
            style={[styles.input, editingIndex !== null && styles.disabledInput]}
            placeholder="Código"
            value={newModelo.codigo}
            onChangeText={(text) => editingIndex === null && setNewModelo({ ...newModelo, codigo: text })}
            keyboardType="numeric"
            editable={editingIndex === null}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={newModelo.nombre}
            onChangeText={(text) => setNewModelo({ ...newModelo, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Año"
            value={newModelo.year}
            onChangeText={(text) => setNewModelo({ ...newModelo, year: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Código de Marca"
            value={newModelo.cod_marca}
            onChangeText={(text) => setNewModelo({ ...newModelo, cod_marca: text })}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRegisterOrUpdate}
          >
            <Text style={styles.primaryButtonText}>
              {editingIndex !== null ? 'Actualizar Modelo' : 'Registrar Modelo'}
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

export default Modelos;