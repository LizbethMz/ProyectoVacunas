import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getIncidentes, createIncidente, updateIncidente, deleteIncidente } from '../api/IncidentesApi';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Incidentes = () => {
  const [incidentesData, setIncidentesData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newIncidente, setNewIncidente] = useState({
    codigo: '',
    descripcion: '',
    num_envio: '',
  });

  const fetchData = async () => {
    try {
      const data = await getIncidentes();
      setIncidentesData(data);
    } catch (error) {
      console.error('Error obteniendo datos de incidentes:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    if (editingIndex !== null) {
      try {
        await updateIncidente(newIncidente.codigo, newIncidente);
        fetchData();
        setEditingIndex(null);
      } catch (error) {
        console.error('Error actualizando incidente:', error);
      }
    } else {
      try {
        await createIncidente(newIncidente);
        fetchData();
      } catch (error) {
        console.error('Error registrando incidente:', error);
      }
    }
    setNewIncidente({ codigo: '', descripcion: '', num_envio: '' });
    setIsRegistering(false);
  };

  const handleEdit = (index) => {
    setNewIncidente(incidentesData[index]);
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const codigo = incidentesData[index].codigo;
      await deleteIncidente(codigo);
      fetchData();
    } catch (error) {
      console.error('Error eliminando incidente:', error);
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  // Función para determinar el color según la gravedad del incidente (puedes personalizarla)
  const getIncidenteColor = (descripcion) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes('grave') || desc.includes('urgente')) return '#E74C3C';
    if (desc.includes('leve')) return '#F39C12';
    return '#3498DB';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Incidentes</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConsult}
        >
          <Icon name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Consultar Incidentes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setIsRegistering(true);
            setIsConsulting(false);
            setEditingIndex(null);
          }}
        >
          <Icon name="exclamation-triangle" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Registrar Incidente</Text>
        </TouchableOpacity>
      </View>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Registro de Incidentes</Text>
          {incidentesData.map((incidente, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="exclamation-circle" size={24} color={getIncidenteColor(incidente.descripcion)} />
                <Text style={styles.cardTitle}>Incidente #{incidente.codigo}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getIncidenteColor(incidente.descripcion) }]} />
              </View>
              
              <View style={styles.cardBody}>
                <Text style={styles.cardText}>
                  <Text style={styles.label}>Envío:</Text> #{incidente.num_envio}
                </Text>
                <Text style={styles.descriptionText}>
                  {incidente.descripcion}
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
            {editingIndex !== null ? 'Editar Incidente' : 'Registrar Nuevo Incidente'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Código"
            value={newIncidente.codigo}
            onChangeText={(text) => setNewIncidente({ ...newIncidente, codigo: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción del incidente"
            value={newIncidente.descripcion}
            onChangeText={(text) => setNewIncidente({ ...newIncidente, descripcion: text })}
            multiline
            numberOfLines={4}
          />
          <TextInput
            style={styles.input}
            placeholder="Número de envío"
            value={newIncidente.num_envio}
            onChangeText={(text) => setNewIncidente({ ...newIncidente, num_envio: text })}
            keyboardType="numeric"
          />
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleRegisterOrUpdate}
          >
            <Text style={styles.primaryButtonText}>
              {editingIndex !== null ? 'Actualizar Incidente' : 'Registrar Incidente'}
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
    flex: 1,
  },
  statusBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
  descriptionText: {
    fontSize: 14,
    color: '#5D6D7E',
    marginTop: 5,
    lineHeight: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Incidentes;