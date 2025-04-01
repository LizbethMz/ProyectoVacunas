import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getFarmaceuticas, createFarmaceutica, updateFarmaceutica, deleteFarmaceutica } from '../api/FarmaceuticasApi';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Farmaceuticas = () => {
  const [farmaceuticasData, setFarmaceuticasData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newFarmaceutica, setNewFarmaceutica] = useState({
    codigo: '',
    nombre: '',
    telefono: '',
    correo: ''
  });

  const fetchData = async () => {
    try {
      const data = await getFarmaceuticas();
      setFarmaceuticasData(data);
    } catch (error) {
      console.error('Error obteniendo datos de farmacéuticas:', error);
      alert('Error al cargar las farmacéuticas');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    try {
      if (editingIndex !== null) {
        // Solo enviamos código, teléfono y correo para actualizar
        const { codigo, telefono, correo } = newFarmaceutica;
        await updateFarmaceutica(codigo, { telefono, correo });
        alert('Contacto de farmacéutica actualizado correctamente');
      } else {
        await createFarmaceutica(newFarmaceutica);
        alert('Farmacéutica registrada correctamente');
      }
      fetchData();
      setEditingIndex(null);
      setNewFarmaceutica({ 
        codigo: '',
        nombre: '',
        telefono: '',
        correo: ''
      });
      setIsRegistering(false);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (index) => {
    const farmaceuticaToEdit = farmaceuticasData[index];
    setNewFarmaceutica({
      codigo: farmaceuticaToEdit.codigo?.toString() || '',
      telefono: farmaceuticaToEdit.telefono || '',
      correo: farmaceuticaToEdit.correo || ''
    });
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const codigo = farmaceuticasData[index].codigo;
      await deleteFarmaceutica(codigo);
      alert('Farmacéutica eliminada correctamente');
      fetchData();
    } catch (error) {
      console.error('Error eliminando farmacéutica:', error);
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  const getFarmaceuticaInfo = (field) => {
    if (editingIndex === null) return '';
    const farmaceutica = farmaceuticasData.find(f => f.codigo.toString() === newFarmaceutica.codigo);
    return farmaceutica ? farmaceutica[field] : '';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Farmacéuticas</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConsult}
        >
          <Icon name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Consultar Farmacéuticas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setIsRegistering(true);
            setIsConsulting(false);
            setEditingIndex(null);
            setNewFarmaceutica({ 
              codigo: '',
              nombre: '',
              telefono: '',
              correo: ''
            });
          }}
        >
          <Icon name="plus-circle" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Registrar Nueva Farmacéutica</Text>
        </TouchableOpacity>
      </View>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Farmacéuticas</Text>
          {farmaceuticasData.map((farmaceutica, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="prescription-bottle-alt" size={24} color="#005398" />
                <Text style={styles.cardTitle}>Farmacéutica #{farmaceutica.codigo}</Text>
              </View>
              
              <View style={styles.cardBody}>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Nombre:</Text> {farmaceutica.nombre}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Teléfono:</Text> {farmaceutica.telefono}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Correo:</Text> {farmaceutica.correo}
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
          <Text style={styles.subTitle}>Registrar Nueva Farmacéutica</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Código"
            value={newFarmaceutica.codigo}
            onChangeText={(text) => setNewFarmaceutica({ ...newFarmaceutica, codigo: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={newFarmaceutica.nombre}
            onChangeText={(text) => setNewFarmaceutica({ ...newFarmaceutica, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={newFarmaceutica.telefono}
            onChangeText={(text) => setNewFarmaceutica({ ...newFarmaceutica, telefono: text })}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={newFarmaceutica.correo}
            onChangeText={(text) => setNewFarmaceutica({ ...newFarmaceutica, correo: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleRegisterOrUpdate}
          >
            <Text style={styles.primaryButtonText}>Registrar Farmacéutica</Text>
          </TouchableOpacity>
        </View>
      )}

      {isRegistering && editingIndex !== null && (
        <View style={styles.form}>
          <Text style={styles.subTitle}>Editar Contacto de Farmacéutica</Text>
          
          {/* Información no editable */}
          <View style={styles.disabledInputContainer}>
            <Text style={styles.disabledInputLabel}>Código:</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>{newFarmaceutica.codigo}</Text>
            </View>
          </View>
          
          <View style={styles.disabledInputContainer}>
            <Text style={styles.disabledInputLabel}>Nombre:</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>{getFarmaceuticaInfo('nombre')}</Text>
            </View>
          </View>
          
          {/* Campos editables */}
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={newFarmaceutica.telefono}
            onChangeText={(text) => setNewFarmaceutica({ ...newFarmaceutica, telefono: text })}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={newFarmaceutica.correo}
            onChangeText={(text) => setNewFarmaceutica({ ...newFarmaceutica, correo: text })}
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

// Reutiliza los mismos estilos del componente Sucursales
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

export default Farmaceuticas;