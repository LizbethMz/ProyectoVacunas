import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getPlantas, createPlanta, updatePlanta, deletePlanta } from '../api/PlantasApi';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Plantas = () => {
  const [plantasData, setPlantasData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newPlanta, setNewPlanta] = useState({
    numero: '',
    nombre: '',
    pais: '',
    colonia: '',
    calle: '',
    numeroD: '',
    codigo_postal: '',
    telefono: '',
    correo: '',
    cod_laboratorio: '',
    cod_ciudad: ''
  });

  const fetchData = async () => {
    try {
      const data = await getPlantas();
      setPlantasData(data);
    } catch (error) {
      console.error('Error obteniendo datos de plantas:', error);
      alert('Error al cargar las plantas');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    try {
      if (editingIndex !== null) {
        // Solo enviamos número, teléfono y correo para actualizar
        const { numero, telefono, correo } = newPlanta;
        await updatePlanta(numero, { telefono, correo });
        alert('Contacto de planta actualizado correctamente');
      } else {
        await createPlanta(newPlanta);
        alert('Planta registrada correctamente');
      }
      fetchData();
      setEditingIndex(null);
      setNewPlanta({ 
        numero: '',
        nombre: '',
        pais: '',
        colonia: '',
        calle: '',
        numeroD: '',
        codigo_postal: '',
        telefono: '',
        correo: '',
        cod_laboratorio: '',
        cod_ciudad: ''
      });
      setIsRegistering(false);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (index) => {
    const plantaToEdit = plantasData[index];
    setNewPlanta({
      numero: plantaToEdit.numero?.toString() || '',
      telefono: plantaToEdit.telefono || '',
      correo: plantaToEdit.correo || ''
    });
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const numero = plantasData[index].numero;
      await deletePlanta(numero);
      alert('Planta eliminada correctamente');
      fetchData();
    } catch (error) {
      console.error('Error eliminando planta:', error);
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  const getPlantaInfo = (field) => {
    if (editingIndex === null) return '';
    const planta = plantasData.find(p => p.numero.toString() === newPlanta.numero);
    return planta ? planta[field] : '';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Plantas</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConsult}
        >
          <Icon name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Consultar Plantas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setIsRegistering(true);
            setIsConsulting(false);
            setEditingIndex(null);
            setNewPlanta({ 
              numero: '',
              nombre: '',
              pais: '',
              colonia: '',
              calle: '',
              numeroD: '',
              codigo_postal: '',
              telefono: '',
              correo: '',
              cod_laboratorio: '',
              cod_ciudad: ''
            });
          }}
        >
          <Icon name="plus-circle" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Registrar Nueva Planta</Text>
        </TouchableOpacity>
      </View>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Plantas</Text>
          {plantasData.map((planta, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="leaf" size={24} color="#005398" />
                <Text style={styles.cardTitle}>Planta #{planta.numero}</Text>
              </View>
              
              <View style={styles.cardBody}>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Nombre:</Text> {planta.nombre}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>País:</Text> {planta.pais}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Dirección:</Text> {planta.calle} {planta.numeroD}, {planta.colonia}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Código Postal:</Text> {planta.codigo_postal}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Teléfono:</Text> {planta.telefono}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Correo:</Text> {planta.correo}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Laboratorio:</Text> {planta.cod_laboratorio}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Ciudad:</Text> {planta.cod_ciudad}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <TouchableOpacity 
                  style={styles.secondaryButton} 
                  onPress={() => handleEdit(index)}
                >
                  <Icon name="edit" size={16} color="#fff" />
                  <Text style={styles.secondaryButtonText}> Editar Contacto</Text>
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

      {isRegistering && editingIndex === null && (
        <View style={styles.form}>
          <Text style={styles.subTitle}>Registrar Nueva Planta</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={newPlanta.numero}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, numero: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={newPlanta.nombre}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="País"
            value={newPlanta.pais}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, pais: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Colonia"
            value={newPlanta.colonia}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, colonia: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Calle"
            value={newPlanta.calle}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, calle: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={newPlanta.numeroD}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, numeroD: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Código Postal"
            value={newPlanta.codigo_postal}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, codigo_postal: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={newPlanta.telefono}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, telefono: text })}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={newPlanta.correo}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, correo: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Código Laboratorio"
            value={newPlanta.cod_laboratorio}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, cod_laboratorio: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Código Ciudad"
            value={newPlanta.cod_ciudad}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, cod_ciudad: text })}
            keyboardType="numeric"
          />
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleRegisterOrUpdate}
          >
            <Text style={styles.primaryButtonText}>Registrar Planta</Text>
          </TouchableOpacity>
        </View>
      )}

      {isRegistering && editingIndex !== null && (
        <View style={styles.form}>
          <Text style={styles.subTitle}>Editar Contacto de Planta</Text>
          
          {/* Información no editable */}
          <View style={styles.disabledInputContainer}>
            <Text style={styles.disabledInputLabel}>Número:</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>{newPlanta.numero}</Text>
            </View>
          </View>
          
          <View style={styles.disabledInputContainer}>
            <Text style={styles.disabledInputLabel}>Nombre:</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>{getPlantaInfo('nombre')}</Text>
            </View>
          </View>
          
          <View style={styles.disabledInputContainer}>
            <Text style={styles.disabledInputLabel}>Dirección:</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>
                {getPlantaInfo('calle')} {getPlantaInfo('numeroD')}, {getPlantaInfo('colonia')}
              </Text>
            </View>
          </View>
          
          {/* Campos editables */}
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={newPlanta.telefono}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, telefono: text })}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={newPlanta.correo}
            onChangeText={(text) => setNewPlanta({ ...newPlanta, correo: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleRegisterOrUpdate}
          >
            <Text style={styles.primaryButtonText}>Actualizar Contacto</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

// Reutiliza los mismos estilos de los componentes anteriores
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
  disabledInputContainer: {
    marginBottom: 15,
  },
  disabledInputLabel: {
    fontSize: 16,
    color: '#005398',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#D6EAF8',
    padding: 12,
    borderRadius: 5,
  },
  disabledInputText: {
    fontSize: 16,
    color: '#555',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Plantas;