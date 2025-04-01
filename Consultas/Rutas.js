import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getRutas, createRuta, updateRuta, deleteRuta } from '../api/RutasApi';
import { getCiudades } from '../api/CiudadesApi';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Rutas = () => {
  const [rutasData, setRutasData] = useState([]);
  const [ciudadesData, setCiudadesData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [isViewingCities, setIsViewingCities] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newRuta, setNewRuta] = useState({
    numero: '',
    nombre: '',
    f_salida: '',
    f_llegada: '',
    h_salida: '',
    h_llegada: '',
    num_planta: '',
    cod_sucursal: '',
  });

  const fetchRutas = async () => {
    try {
      const data = await getRutas();
      setRutasData(data);
    } catch (error) {
      console.error('Error obteniendo datos de rutas:', error);
    }
  };

  const fetchCiudades = async () => {
    try {
      const data = await getCiudades();
      setCiudadesData(data);
    } catch (error) {
      console.error('Error obteniendo datos de ciudades:', error);
    }
  };

  useEffect(() => {
    fetchRutas();
    fetchCiudades();
  }, []);

  const handleRegisterOrUpdate = async () => {
    if (editingIndex !== null) {
      try {
        await updateRuta(newRuta);
        fetchRutas();
        setEditingIndex(null);
      } catch (error) {
        console.error('Error actualizando ruta:', error);
      }
    } else {
      try {
        await createRuta(newRuta);
        fetchRutas();
      } catch (error) {
        console.error('Error registrando ruta:', error);
      }
    }
    setNewRuta({
      numero: '',
      nombre: '',
      f_salida: '',
      f_llegada: '',
      h_salida: '',
      h_llegada: '',
      num_planta: '',
      cod_sucursal: '',
    });
    setIsRegistering(false);
  };

  const handleEdit = (index) => {
    setNewRuta(rutasData[index]);
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
    setIsViewingCities(false);
  };

  const handleDelete = async (index) => {
    try {
      const numero = rutasData[index].numero;
      await deleteRuta(numero);
      fetchRutas();
    } catch (error) {
      console.error('Error eliminando ruta:', error);
    }
  };

  const handleConsult = () => {
    fetchRutas();
    setIsConsulting(true);
    setIsRegistering(false);
    setIsViewingCities(false);
  };

  const handleViewCities = () => {
    fetchCiudades();
    setIsViewingCities(true);
    setIsConsulting(false);
    setIsRegistering(false);
  };

  const getRutaStatus = (f_salida, f_llegada) => {
    const hoy = new Date();
    const salida = new Date(f_salida);
    const llegada = new Date(f_llegada);
    
    if (hoy < salida) return '#3498DB'; // Azul: Pendiente
    if (hoy >= salida && hoy <= llegada) return '#2ECC71'; // Verde: En curso
    return '#E74C3C'; // Rojo: Finalizado
  };

  const renderLockedFieldInfo = () => (
    <View style={styles.lockedInfo}>
      <Icon name="info-circle" size={14} color="#666" />
      <Text style={styles.lockedInfoText}>Este campo no se puede editar</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Rutas</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConsult}
        >
          <Icon name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Consultar Rutas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setIsRegistering(true);
            setIsConsulting(false);
            setIsViewingCities(false);
            setEditingIndex(null);
          }}
        >
          <Icon name="route" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Registrar Nueva Ruta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleViewCities}
        >
          <Icon name="city" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Ver Ciudades</Text>
        </TouchableOpacity>
      </View>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Rutas</Text>
          {rutasData.map((ruta, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="route" size={24} color="#005398" />
                <Text style={styles.cardTitle}>Ruta #{ruta.numero} - {ruta.nombre}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getRutaStatus(ruta.f_salida, ruta.f_llegada) }]} />
              </View>
              
              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <Icon name="calendar-alt" size={16} color="#005398" />
                  <Text style={styles.cardText}>
                    <Text style={styles.label}> Salida:</Text> {ruta.f_salida} {ruta.h_salida}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="calendar-check" size={16} color="#005398" />
                  <Text style={styles.cardText}>
                    <Text style={styles.label}> Llegada:</Text> {ruta.f_llegada} {ruta.h_llegada}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="industry" size={16} color="#005398" />
                  <Text style={styles.cardText}>
                    <Text style={styles.label}> Planta:</Text> {ruta.num_planta}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="store" size={16} color="#005398" />
                  <Text style={styles.cardText}>
                    <Text style={styles.label}> Sucursal:</Text> {ruta.cod_sucursal}
                  </Text>
                </View>
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
            {editingIndex !== null ? 'Editar Ruta' : 'Registrar Nueva Ruta'}
          </Text>
          
          {/* Número - Bloqueado en edición */}
          <View>
            <TextInput
              style={[styles.input, editingIndex !== null && styles.disabledInput]}
              placeholder="Número"
              value={newRuta.numero}
              onChangeText={(text) => setNewRuta({ ...newRuta, numero: text })}
              keyboardType="numeric"
              editable={editingIndex === null}
            />
            {editingIndex !== null && renderLockedFieldInfo()}
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Nombre (ej. TEC-TIJ)"
            value={newRuta.nombre}
            onChangeText={(text) => setNewRuta({ ...newRuta, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha Salida (YYYY-MM-DD)"
            value={newRuta.f_salida}
            onChangeText={(text) => setNewRuta({ ...newRuta, f_salida: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha Llegada (YYYY-MM-DD)"
            value={newRuta.f_llegada}
            onChangeText={(text) => setNewRuta({ ...newRuta, f_llegada: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Hora Salida (HH:MM:SS)"
            value={newRuta.h_salida}
            onChangeText={(text) => setNewRuta({ ...newRuta, h_salida: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Hora Llegada (HH:MM:SS)"
            value={newRuta.h_llegada}
            onChangeText={(text) => setNewRuta({ ...newRuta, h_llegada: text })}
          />
          
          {/* Número Planta - Bloqueado en edición */}
          <View>
            <TextInput
              style={[styles.input, editingIndex !== null && styles.disabledInput]}
              placeholder="Número Planta"
              value={newRuta.num_planta}
              onChangeText={(text) => setNewRuta({ ...newRuta, num_planta: text })}
              keyboardType="numeric"
              editable={editingIndex === null}
            />
            {editingIndex !== null && renderLockedFieldInfo()}
          </View>
          
          {/* Código Sucursal - Bloqueado en edición */}
          <View>
            <TextInput
              style={[styles.input, editingIndex !== null && styles.disabledInput]}
              placeholder="Código Sucursal"
              value={newRuta.cod_sucursal}
              onChangeText={(text) => setNewRuta({ ...newRuta, cod_sucursal: text })}
              keyboardType="numeric"
              editable={editingIndex === null}
            />
            {editingIndex !== null && renderLockedFieldInfo()}
          </View>
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleRegisterOrUpdate}
          >
            <Text style={styles.primaryButtonText}>
              {editingIndex !== null ? 'Actualizar Ruta' : 'Registrar Ruta'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isViewingCities && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Listado de Ciudades</Text>
          {ciudadesData.map((ciudad, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="city" size={24} color="#005398" />
                <Text style={styles.cardTitle}>{ciudad.nombre}</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <Icon name="hashtag" size={16} color="#005398" />
                  <Text style={styles.cardText}>
                    <Text style={styles.label}> Código:</Text> {ciudad.codigo}
                  </Text>
                </View>
              </View>
            </View>
          ))}
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#666',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
  },
  lockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 15,
  },
  lockedInfoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
});

export default Rutas;