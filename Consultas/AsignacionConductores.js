import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getCamionesDisponibles, getConductoresDisponibles, getAsignaciones, createAsignacion, deleteAsignacion } from '../api/CamionConductorApi';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';

const AsignacionConductores = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [camiones, setCamiones] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [form, setForm] = useState({
    cod_camion: '',
    num_conductor: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener camiones disponibles
      const camionesData = await getCamionesDisponibles();
      setCamiones(camionesData);
      
      // Obtener conductores disponibles
      const conductoresData = await getConductoresDisponibles();
      setConductores(conductoresData);
      
      // Obtener asignaciones actuales
      const asignacionesData = await getAsignaciones();
      console.log(asignacionesData);
      setAsignaciones(asignacionesData);
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      Alert.alert('Error', error.message || 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAsignar = async () => {
    if (!form.cod_camion || !form.num_conductor) {
        console.error('Error: Debes seleccionar un camión y un conductor');
        return;
    }

    console.log("Formulario antes de asignar:", form);

    try {
        console.log("Enviando datos a createAsignacion...");
        const result = await createAsignacion(form);
        console.log("Resultado de createAsignacion:", result);

        if (result.success) {
            console.log('Asignación creada correctamente');
            setForm({ cod_camion: '', num_conductor: '' });
            fetchData();
        } else {
            console.error('Error al crear la asignación:', result.error || result.message);
        }
    } catch (error) {
        console.error('Error asignando:', error);
    }
};



  const handleEliminar = async (cod_camion, num_conductor) => {
    try {
      const result = await deleteAsignacion({ cod_camion, num_conductor });

      if (result.success) {
        Alert.alert('Éxito', result.message || 'Asignación eliminada correctamente');
        fetchData();
      } else {
        Alert.alert('Error', result.error || result.message || 'No se pudo eliminar la asignación');
      }
    } catch (error) {
      console.error('Error eliminando asignación:', error);
      Alert.alert('Error', error.message || 'No se pudo eliminar la asignación');
    }
};


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Asignación de Conductores a Camiones</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Seleccionar Camión:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.cod_camion}
            onValueChange={(value) => setForm({ ...form, cod_camion: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un camión" value="" />
            {camiones.map(camion => (
              <Picker.Item 
                key={camion.codigo} 
                label={`${camion.matricula} (${camion.codigo})`} 
                value={camion.codigo} 
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Seleccionar Conductor:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.num_conductor}
            onValueChange={(value) => setForm({ ...form, num_conductor: value })}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un conductor" value="" />
            {conductores.map(conductor => (
              <Picker.Item 
                key={conductor.numero} 
                label={`${conductor.nombre_pila} ${conductor.apellidoP} ${conductor.apellidoM} (${conductor.numero})`} 
                value={conductor.numero} 
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleAsignar}
          disabled={!form.cod_camion || !form.num_conductor}
        >
          <Text style={styles.buttonText}>Asignar Conductor a Camión</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Asignaciones Actuales</Text>
      {asignaciones.length === 0 ? (
        <Text style={styles.noData}>No hay asignaciones registradas</Text>
      ) : (
        asignaciones.map((asignacion, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="truck" size={20} color="#005398" />
              <Text style={styles.cardTitle}>Camión: {asignacion.matricula}</Text>
            </View>
            <Text style={styles.cardText}>Conductor: {asignacion.nombre_conductor}</Text>
            <Text style={styles.cardText}>Fecha: {new Date(asignacion.fecha_asignacion).toLocaleString()}</Text>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => handleEliminar(asignacion.cod_camion, asignacion.num_conductor)}
            >
              <Icon name="trash-alt" size={16} color="#fff" />
              <Text style={styles.deleteButtonText}> Eliminar Asignación</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005398',
    marginTop: 20,
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
  },
  button: {
    backgroundColor: '#005398',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005398',
    marginLeft: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noData: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
    marginTop: 10,
  },
});

export default AsignacionConductores;