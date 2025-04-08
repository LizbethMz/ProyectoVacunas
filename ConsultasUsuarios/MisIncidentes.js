import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getEnviosActivosPorConductor } from '../api/EnviosApi';

// Usar la IP local del dispositivo
const API_URL = 'http://172.18.3.83/ProyectoApp'; // Cambia esta IP por la de tu computadora
// const API_URL = 'http://10.0.2.2/ProyectoApp'; // Para Android Emulator
// const API_URL = 'http://localhost/ProyectoApp'; // Para iOS Simulator

const MisIncidentes = ({ route, navigation }) => {
  const [incidentes, setIncidentes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [envios, setEnvios] = useState([]);
  const [envioSeleccionado, setEnvioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const { conductorId } = route.params;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      console.log('Iniciando carga de datos...');
      console.log('URL base:', API_URL);
      console.log('Conductor ID:', conductorId);
      
      await Promise.all([
        cargarIncidentes(),
        cargarEnvios()
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      console.error('Stack trace:', error.stack);
      
      let errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica:\n\n';
      errorMessage += '1. Que estás conectado a la misma red WiFi que tu computadora\n';
      errorMessage += '2. Que la IP del servidor es correcta\n';
      errorMessage += '3. Que XAMPP está corriendo\n';
      errorMessage += '4. Que el puerto 80 está disponible\n\n';
      errorMessage += `Error detallado: ${error.message}`;

      Alert.alert(
        'Error de conexión',
        errorMessage,
        [
          {
            text: 'Reintentar',
            onPress: () => cargarDatos()
          },
          {
            text: 'Cancelar',
            style: 'cancel'
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const cargarIncidentes = async () => {
    try {
        console.log('Cargando incidentes...');
        const response = await fetch(`${API_URL}/backend/consultasUsuarios/getIncidentesChofer.php?conductorId=${conductorId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            credentials: 'include'
        });

        console.log('Estado de la respuesta:', response.status);
        const data = await response.json();
        console.log('Respuesta de incidentes:', data);

        if (data.success && Array.isArray(data.data)) {
            setIncidentes(data.data);
        } else {
            console.error('Error en la respuesta de incidentes:', data);
            setIncidentes([]);
        }
    } catch (error) {
        console.error('Error al cargar incidentes:', error);
        setIncidentes([]);
    }
  };

  const cargarEnvios = async () => {
    try {
        console.log('Cargando envíos...');
        const response = await fetch(`${API_URL}/backend/consultasUsuarios/envios_conductor.php?conductorId=${conductorId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            credentials: 'include'
        });

        console.log('Estado de la respuesta:', response.status);
        const data = await response.json();
        console.log('Respuesta de envíos:', data);

        if (data.success && Array.isArray(data.data)) {
            const enviosProcesados = data.data.map(envio => ({
                ...envio,
                id: String(envio.numero)
            }));
            console.log('Envíos procesados:', enviosProcesados);
            setEnvios(enviosProcesados);
            if (enviosProcesados.length > 0) {
                setEnvioSeleccionado(enviosProcesados[0].id);
            } else {
                console.log('No hay envíos disponibles');
                setEnvioSeleccionado(null);
            }
        } else {
            console.error('Error en la respuesta de envíos:', data);
            setEnvios([]);
            setEnvioSeleccionado(null);
        }
    } catch (error) {
        console.error('Error al cargar envíos:', error);
        setEnvios([]);
        setEnvioSeleccionado(null);
    }
  };

  const handleSubmit = async () => {
    if (!envioSeleccionado) {
      Alert.alert('Error', 'Por favor selecciona un envío');
      return;
    }
    if (!descripcion.trim()) {
      Alert.alert('Error', 'Por favor describe el incidente');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/backend/consultasUsuarios/registrar_incidente.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num_envio: parseInt(envioSeleccionado),
          descripcion: descripcion.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Éxito', 'Incidente reportado correctamente');
        setModalVisible(false);
        setDescripcion('');
        cargarIncidentes();
      } else {
        Alert.alert('Error', data.message || 'Error al reportar el incidente');
      }
    } catch (error) {
      console.error('Error al reportar incidente:', error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    }
  };

  const cambiarEstadoEnvio = async (envioId, nuevoEstado) => {
    try {
        const response = await fetch(`${API_URL}/backend/consultasUsuarios/actualizar_estado.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                envioId,
                nuevoEstado
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            Alert.alert('Éxito', 'Estado actualizado correctamente');
            cargarDatos();
        } else {
            throw new Error(data.message || 'Error al actualizar el estado');
        }
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        Alert.alert('Error', 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    }
  };

  const renderIncidente = (incidente) => (
    <View key={incidente.codigo} style={styles.incidenteCard}>
      <View style={styles.incidenteHeader}>
        <Text style={styles.incidenteTitle}>Incidente #{incidente.codigo}</Text>
        <Text style={styles.incidenteDate}>
          {new Date(incidente.fecha_progr).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.incidenteContent}>
        <Text style={styles.incidenteLabel}>Envío:</Text>
        <Text style={styles.incidenteText}>#{incidente.num_envio}</Text>
        
        <Text style={styles.incidenteLabel}>Origen:</Text>
        <Text style={styles.incidenteText}>{incidente.planta_nombre || 'No disponible'}</Text>
        
        <Text style={styles.incidenteLabel}>Destino:</Text>
        <Text style={styles.incidenteText}>{incidente.sucursal_nombre || 'No disponible'}</Text>
        
        <Text style={styles.incidenteLabel}>Descripción:</Text>
        <Text style={styles.incidenteDescription}>{incidente.descripcion}</Text>
      </View>
    </View>
  );

  const renderEnvio = (envio) => (
    <View key={envio.id} style={styles.envioCard}>
        <View style={styles.envioHeader}>
            <Text style={styles.envioTitle}>Envío #{envio.id}</Text>
            <View style={[
                styles.estadoBadge,
                { backgroundColor: getEstadoColor(envio.estado) }
            ]}>
                <Text style={styles.estadoText}>{envio.estado}</Text>
            </View>
        </View>
        
        <View style={styles.envioContent}>
            <Text style={styles.envioLabel}>Fecha Programada:</Text>
            <Text style={styles.envioText}>{envio.fecha_programada}</Text>
            
            <Text style={styles.envioLabel}>Horario:</Text>
            <Text style={styles.envioText}>{envio.hora_salida} - {envio.hora_llegada}</Text>
            
            <Text style={styles.envioLabel}>Camión:</Text>
            <Text style={styles.envioText}>{envio.camion?.matricula || 'No asignado'}</Text>
            
            <Text style={styles.envioLabel}>Destino:</Text>
            <Text style={styles.envioText}>{envio.sucursal?.nombre || 'No asignado'}</Text>
            
            <Text style={styles.envioLabel}>Origen:</Text>
            <Text style={styles.envioText}>{envio.planta?.nombre || 'No asignado'}</Text>
            
            {envio.ultima_temperatura && (
                <>
                    <Text style={styles.envioLabel}>Última Temperatura:</Text>
                    <Text style={styles.envioText}>{envio.ultima_temperatura.temperatura}°C</Text>
                </>
            )}
            
            {envio.ultima_carga && (
                <>
                    <Text style={styles.envioLabel}>Última Carga:</Text>
                    <Text style={styles.envioText}>{envio.ultima_carga.carga_util} kg</Text>
                </>
            )}
        </View>
    </View>
  );

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
        case 'pendiente':
            return '#FFA500';
        case 'en proceso':
            return '#4169E1';
        case 'completado':
            return '#32CD32';
        case 'cancelado':
            return '#FF0000';
        default:
            return '#808080';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#005398" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Incidentes</Text>
        <TouchableOpacity
          style={[styles.addButton, envios.length === 0 && styles.disabledButton]}
          onPress={() => setModalVisible(true)}
          disabled={envios.length === 0}
        >
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Reportar Nuevo Incidente</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {incidentes.length > 0 ? (
          incidentes.map(renderIncidente)
        ) : (
          <Text style={styles.noDataText}>No hay incidentes reportados</Text>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reportar Incidente</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="times" size={24} color="#005398" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {envios.length > 0 ? (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Selecciona el envío:</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={envioSeleccionado}
                        onValueChange={(itemValue) => {
                          console.log('Envío seleccionado:', itemValue);
                          setEnvioSeleccionado(itemValue);
                        }}
                        style={styles.picker}
                      >
                        {envios.map((envio) => (
                          <Picker.Item
                            key={`envio-${envio.id}`}
                            label={`Envío #${envio.id} - ${envio.sucursal_nombre}`}
                            value={envio.id}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Descripción del incidente:</Text>
                    <TextInput
                      style={styles.textArea}
                      multiline
                      numberOfLines={4}
                      value={descripcion}
                      onChangeText={setDescripcion}
                      placeholder="Describe el incidente..."
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>Reportar Incidente</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.noDataText}>No hay envíos disponibles</Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#005398',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005398',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  incidenteCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  incidenteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  incidenteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005398',
  },
  incidenteDate: {
    fontSize: 14,
    color: '#666',
  },
  incidenteContent: {
    marginTop: 10,
  },
  incidenteLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  incidenteText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  incidenteDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#005398',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  envioCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  envioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  envioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005398',
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  estadoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  envioContent: {
    marginTop: 10,
  },
  envioLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  envioText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default MisIncidentes; 