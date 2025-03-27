import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getRutas, createRuta, updateRuta, deleteRuta } from '../api/RutasApi';

const Rutas = () => {
  const [rutasData, setRutasData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newRuta, setNewRuta] = useState({
    numero: '',
    f_salida: '',
    f_llegada: '',
    h_salida: '',
    h_llegada: '',
    num_envio: '',
    num_planta: '',
    cod_sucursal: '',
  });

  const fetchData = async () => {
    try {
      const data = await getRutas();
      setRutasData(data);
    } catch (error) {
      console.error('Error obteniendo datos de rutas:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    if (editingIndex !== null) {
      try {
        await updateRuta(newRuta);
        fetchData();
        setEditingIndex(null);
      } catch (error) {
        console.error('Error actualizando ruta:', error);
      }
    } else {
      try {
        await createRuta(newRuta);
        fetchData();
      } catch (error) {
        console.error('Error registrando ruta:', error);
      }
    }
    setNewRuta({
      numero: '',
      f_salida: '',
      f_llegada: '',
      h_salida: '',
      h_llegada: '',
      num_envio: '',
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
  };

  const handleDelete = async (index) => {
    try {
      const numero = rutasData[index].numero;
      await deleteRuta(numero);
      fetchData();
    } catch (error) {
      console.error('Error eliminando ruta:', error);
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Rutas</Text>

      <TouchableOpacity style={styles.button} onPress={handleConsult}>
        <Text style={styles.buttonText}>Consultar Información</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsRegistering(true);
          setIsConsulting(false);
          setEditingIndex(null);
        }}
      >
        <Text style={styles.buttonText}>Registrar Ruta</Text>
      </TouchableOpacity>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Rutas</Text>
          {rutasData.map((ruta, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Número:</Text> {ruta.numero}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Fecha Salida:</Text> {ruta.f_salida}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Fecha Llegada:</Text> {ruta.f_llegada}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Hora Salida:</Text> {ruta.h_salida}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Hora Llegada:</Text> {ruta.h_llegada}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Número Envío:</Text> {ruta.num_envio}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Número Planta:</Text> {ruta.num_planta}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Código Sucursal:</Text> {ruta.cod_sucursal}
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(index)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {isRegistering && (
        <View style={styles.form}>
          <Text style={styles.subTitle}>{editingIndex !== null ? 'Editar Ruta' : 'Registrar Nueva Ruta'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={newRuta.numero}
            onChangeText={(text) => setNewRuta({ ...newRuta, numero: text })}
            keyboardType="numeric"
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
          <TextInput
            style={styles.input}
            placeholder="Número Envío"
            value={newRuta.num_envio}
            onChangeText={(text) => setNewRuta({ ...newRuta, num_envio: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Número Planta"
            value={newRuta.num_planta}
            onChangeText={(text) => setNewRuta({ ...newRuta, num_planta: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Código Sucursal"
            value={newRuta.cod_sucursal}
            onChangeText={(text) => setNewRuta({ ...newRuta, cod_sucursal: text })}
            keyboardType="numeric"
          />
          <Button title={editingIndex !== null ? 'Actualizar' : 'Registrar'} onPress={handleRegisterOrUpdate} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'rgb(230, 242, 255)',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 16,
    color: '#005398',
  },
  label: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'rgb(0, 64, 128)',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#F0A500',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#D7263D',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  form: {
    width: '90%',
    padding: 20,
    backgroundColor: 'rgb(230, 242, 255)',
    borderRadius: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

export default Rutas;