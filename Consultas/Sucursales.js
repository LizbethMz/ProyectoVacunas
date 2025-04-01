import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getSucursales, createSucursal, updateSucursal, deleteSucursal } from '../api/SucursalesApi';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Sucursales = () => {
  const [sucursalesData, setSucursalesData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newSucursal, setNewSucursal] = useState({
    codigo: '',
    nombre: '',
    pais: '',
    colonia: '',
    calle: '',
    numeroD: '',
    codigo_postal: '',
    telefono: '',
    correo: '',
    cod_farmaceutica: '',
    cod_ciudad: ''
  });

  const fetchData = async () => {
    try {
      const data = await getSucursales();
      setSucursalesData(data);
    } catch (error) {
      console.error('Error obteniendo datos de sucursales:', error);
      alert('Error al cargar las sucursales');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    try {
      if (editingIndex !== null) {
        // Solo enviamos código, teléfono y correo para actualizar
        const { codigo, telefono, correo } = newSucursal;
        await updateSucursal(codigo, { telefono, correo });
        alert('Contacto de sucursal actualizado correctamente');
      } else {
        await createSucursal(newSucursal);
        alert('Sucursal registrada correctamente');
      }
      fetchData();
      setEditingIndex(null);
      setNewSucursal({ 
        codigo: '',
        nombre: '',
        pais: '',
        colonia: '',
        calle: '',
        numeroD: '',
        codigo_postal: '',
        telefono: '',
        correo: '',
        cod_farmaceutica: '',
        cod_ciudad: ''
      });
      setIsRegistering(false);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (index) => {
    const sucursalToEdit = sucursalesData[index];
    setNewSucursal({
      codigo: sucursalToEdit.codigo?.toString() || '',
      telefono: sucursalToEdit.telefono || '',
      correo: sucursalToEdit.correo || ''
    });
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const codigo = sucursalesData[index].codigo;
      await deleteSucursal(codigo);
      alert('Sucursal eliminada correctamente');
      fetchData();
    } catch (error) {
      console.error('Error eliminando sucursal:', error);
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  const getSucursalInfo = (field) => {
    if (editingIndex === null) return '';
    const sucursal = sucursalesData.find(s => s.codigo.toString() === newSucursal.codigo);
    return sucursal ? sucursal[field] : '';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Sucursales</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConsult}
        >
          <Icon name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Consultar Sucursales</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setIsRegistering(true);
            setIsConsulting(false);
            setEditingIndex(null);
            setNewSucursal({ 
              codigo: '',
              nombre: '',
              pais: '',
              colonia: '',
              calle: '',
              numeroD: '',
              codigo_postal: '',
              telefono: '',
              correo: '',
              cod_farmaceutica: '',
              cod_ciudad: ''
            });
          }}
        >
          <Icon name="plus-circle" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Registrar Nueva Sucursal</Text>
        </TouchableOpacity>
      </View>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Sucursales</Text>
          {sucursalesData.map((sucursal, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="store" size={24} color="#005398" />
                <Text style={styles.cardTitle}>Sucursal #{sucursal.codigo}</Text>
              </View>
              
              <View style={styles.cardBody}>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Nombre:</Text> {sucursal.nombre}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>País:</Text> {sucursal.pais}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Dirección:</Text> {sucursal.calle} {sucursal.numeroD}, {sucursal.colonia}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Código Postal:</Text> {sucursal.codigo_postal}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Teléfono:</Text> {sucursal.telefono}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Correo:</Text> {sucursal.correo}
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
          <Text style={styles.subTitle}>Registrar Nueva Sucursal</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Código"
            value={newSucursal.codigo}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, codigo: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={newSucursal.nombre}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="País"
            value={newSucursal.pais}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, pais: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Colonia"
            value={newSucursal.colonia}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, colonia: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Calle"
            value={newSucursal.calle}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, calle: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={newSucursal.numeroD}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, numeroD: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Código Postal"
            value={newSucursal.codigo_postal}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, codigo_postal: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={newSucursal.telefono}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, telefono: text })}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={newSucursal.correo}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, correo: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Código Farmacéutica"
            value={newSucursal.cod_farmaceutica}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, cod_farmaceutica: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Código Ciudad"
            value={newSucursal.cod_ciudad}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, cod_ciudad: text })}
            keyboardType="numeric"
          />
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleRegisterOrUpdate}
          >
            <Text style={styles.primaryButtonText}>Registrar Sucursal</Text>
          </TouchableOpacity>
        </View>
      )}

      {isRegistering && editingIndex !== null && (
        <View style={styles.form}>
          <Text style={styles.subTitle}>Editar Contacto de Sucursal</Text>
          
          {/* Información no editable */}
          <View style={styles.disabledInputContainer}>
            <Text style={styles.disabledInputLabel}>Código:</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>{newSucursal.codigo}</Text>
            </View>
          </View>
          
          <View style={styles.disabledInputContainer}>
            <Text style={styles.disabledInputLabel}>Nombre:</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>{getSucursalInfo('nombre')}</Text>
            </View>
          </View>
          
          <View style={styles.disabledInputContainer}>
            <Text style={styles.disabledInputLabel}>Dirección:</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>
                {getSucursalInfo('calle')} {getSucursalInfo('numeroD')}, {getSucursalInfo('colonia')}
              </Text>
            </View>
          </View>
          
          {/* Campos editables */}
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={newSucursal.telefono}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, telefono: text })}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={newSucursal.correo}
            onChangeText={(text) => setNewSucursal({ ...newSucursal, correo: text })}
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

export default Sucursales;