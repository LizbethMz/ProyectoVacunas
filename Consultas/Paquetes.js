import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getPaquetes, createPaquete, updatePaquete, deletePaquete } from '../api/PaquetesApi';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Paquetes = () => {
  const [paquetesData, setPaquetesData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newPaquete, setNewPaquete] = useState({
    codigo: '',
    lote: '',
    temp_requerida: '',
    descripcion: '',
    vacuna: '',
    num_planta: '',
    num_envio: ''
  });

  const fetchData = async () => {
    try {
      const data = await getPaquetes();
      setPaquetesData(data);
    } catch (error) {
      console.error('Error obteniendo datos de paquetes:', error);
      alert('Error al cargar los paquetes');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    try {
      if (editingIndex !== null) {
        await updatePaquete(newPaquete.codigo, newPaquete);
        alert('Paquete actualizado correctamente');
      } else {
        await createPaquete(newPaquete);
        alert('Paquete registrado correctamente');
      }
      fetchData();
      setEditingIndex(null);
      setNewPaquete({ 
        codigo: '', 
        lote: '', 
        temp_requerida: '', 
        descripcion: '', 
        vacuna: '', 
        num_planta: '', 
        num_envio: '' 
      });
      setIsRegistering(false);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (index) => {
    const paqueteToEdit = paquetesData[index];
    setNewPaquete({
      codigo: paqueteToEdit.codigo?.toString() || '',
      lote: paqueteToEdit.lote || '',
      temp_requerida: paqueteToEdit.temp_requerida?.toString() || '',
      descripcion: paqueteToEdit.descripcion || '',
      vacuna: paqueteToEdit.vacuna || '',
      num_planta: paqueteToEdit.num_planta?.toString() || '',
      num_envio: paqueteToEdit.num_envio?.toString() || ''
    });
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const codigo = paquetesData[index].codigo;
      await deletePaquete(codigo);
      alert('Paquete eliminado correctamente');
      fetchData();
    } catch (error) {
      console.error('Error eliminando paquete:', error);
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
      <Text style={styles.title}>Gestión de Paquetes</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConsult}
        >
          <Icon name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Consultar Paquetes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setIsRegistering(true);
            setIsConsulting(false);
            setEditingIndex(null);
            setNewPaquete({ 
              codigo: '', 
              lote: '', 
              temp_requerida: '', 
              descripcion: '', 
              vacuna: '', 
              num_planta: '', 
              num_envio: '' 
            });
          }}
        >
          <Icon name="plus-circle" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Registrar Nuevo Paquete</Text>
        </TouchableOpacity>
      </View>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Paquetes</Text>
          {paquetesData.map((paquete, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="box" size={24} color="#005398" />
                <Text style={styles.cardTitle}>Paquete #{paquete.codigo}</Text>
              </View>
              
              <View style={styles.cardBody}>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Lote:</Text> {paquete.lote}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Temp. Requerida:</Text> {paquete.temp_requerida}°C
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Descripción:</Text> {paquete.descripcion}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Vacuna:</Text> {paquete.vacuna}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>N° Planta:</Text> {paquete.num_planta}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>N° Envío:</Text> {paquete.num_envio}
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
            {editingIndex !== null ? 'Editar Paquete' : 'Registrar Nuevo Paquete'}
          </Text>
          
          <TextInput
            style={[styles.input, editingIndex !== null && styles.disabledInput]}
            placeholder="Código"
            value={newPaquete.codigo}
            onChangeText={(text) => setNewPaquete({ ...newPaquete, codigo: text })}
            keyboardType="numeric"
            editable={editingIndex === null}
          />
          <TextInput
            style={[styles.input, editingIndex !== null && styles.disabledInput]}
            placeholder="Lote"
            value={newPaquete.lote}
            onChangeText={(text) => setNewPaquete({ ...newPaquete, lote: text })}
            editable={editingIndex === null}
          />
          <TextInput
            style={styles.input}
            placeholder="Temperatura Requerida (ej. 2.50)"
            value={newPaquete.temp_requerida}
            onChangeText={(text) => setNewPaquete({ ...newPaquete, temp_requerida: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={newPaquete.descripcion}
            onChangeText={(text) => setNewPaquete({ ...newPaquete, descripcion: text })}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Vacuna"
            value={newPaquete.vacuna}
            onChangeText={(text) => setNewPaquete({ ...newPaquete, vacuna: text })}
          />
          <TextInput
            style={[styles.input, editingIndex !== null && styles.disabledInput]}
            placeholder="Número de Planta"
            value={newPaquete.num_planta}
            onChangeText={(text) => setNewPaquete({ ...newPaquete, num_planta: text })}
            keyboardType="numeric"
            editable={editingIndex === null}
          />
          <TextInput
            style={[styles.input, editingIndex !== null && styles.disabledInput]}
            placeholder="Número de Envío"
            value={newPaquete.num_envio}
            onChangeText={(text) => setNewPaquete({ ...newPaquete, num_envio: text })}
            keyboardType="numeric"
            editable={editingIndex === null}
          />
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleRegisterOrUpdate}
          >
            <Text style={styles.primaryButtonText}>
              {editingIndex !== null ? 'Actualizar Paquete' : 'Registrar Paquete'}
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
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Paquetes;