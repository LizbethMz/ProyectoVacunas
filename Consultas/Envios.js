import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getEnvios, createEnvio, updateEnvio, deleteEnvio } from '../api/EnviosApi';

const Envios = () => {
  const [enviosData, setEnviosData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEnvio, setNewEnvio] = useState({
    numero: '',
    fecha_progr: '',
    hora_salida: '',
    hora_llegada: '',
    cod_camion: '',
    cod_sucursal: '',
  });

  const fetchData = async () => {
    try {
      const data = await getEnvios();
      setEnviosData(data);
    } catch (error) {
      console.error('Error obteniendo datos de envíos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    if (editingIndex !== null) {
      try {
        await updateEnvio(newEnvio.numero, newEnvio);
        fetchData();
        setEditingIndex(null);
      } catch (error) {
        console.error('Error actualizando envío:', error);
      }
    } else {
      try {
        await createEnvio(newEnvio);
        fetchData();
      } catch (error) {
        console.error('Error registrando envío:', error);
      }
    }
    setNewEnvio({ numero: '', fecha_progr: '', hora_salida: '', hora_llegada: '', cod_camion: '', cod_sucursal: '' });
    setIsRegistering(false);
  };

  const handleEdit = (index) => {
    setNewEnvio(enviosData[index]);
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const numero = enviosData[index].numero;
      await deleteEnvio(numero);
      fetchData();
    } catch (error) {
      console.error('Error eliminando envío:', error);
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Envíos</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleConsult}
      >
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
        <Text style={styles.buttonText}>Registrar Envío</Text>
      </TouchableOpacity>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Envíos</Text>
          {enviosData.map((envio, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Número:</Text> {envio.numero}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Fecha Programada:</Text> {envio.fecha_progr}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Hora Salida:</Text> {envio.hora_salida}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Hora Llegada:</Text> {envio.hora_llegada}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Código Camión:</Text> {envio.cod_camion}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Código Sucursal:</Text> {envio.cod_sucursal}
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
          <Text style={styles.subTitle}>{editingIndex !== null ? 'Editar Envío' : 'Registrar Nuevo Envío'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={newEnvio.numero}
            onChangeText={(text) => setNewEnvio({ ...newEnvio, numero: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha Programada (YYYY-MM-DD)"
            value={newEnvio.fecha_progr}
            onChangeText={(text) => setNewEnvio({ ...newEnvio, fecha_progr: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Hora Salida (HH:MM:SS)"
            value={newEnvio.hora_salida}
            onChangeText={(text) => setNewEnvio({ ...newEnvio, hora_salida: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Hora Llegada (HH:MM:SS)"
            value={newEnvio.hora_llegada}
            onChangeText={(text) => setNewEnvio({ ...newEnvio, hora_llegada: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Código Camión"
            value={newEnvio.cod_camion}
            onChangeText={(text) => setNewEnvio({ ...newEnvio, cod_camion: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Código Sucursal"
            value={newEnvio.cod_sucursal}
            onChangeText={(text) => setNewEnvio({ ...newEnvio, cod_sucursal: text })}
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

export default Envios;