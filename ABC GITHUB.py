# ==========================================================
# TESIS DE LICENCIATURA (ALGORITMO ABC)
# Autor(a): Anette Angélica Juárez Sánchez
# Co-Asesora: Dra. Dynhora Danheyda Ramírez Ochoa
# Asesor: Dr. Luis Pérez-Domínguez
# Universidad Autónoma de Ciudad Juárez
# Inicio: 05/06/2025 | Última modificación: / /2025
# ==========================================================

import numpy as np
import pandas as pd
from datetime import datetime

# ==========================================================
# SECCIÓN 1: SELECCIÓN DE DATOS
# ==========================================================
# En esta sección, el usuario elige la forma en que se obtendrán los datos iniciales:
#  1. Cargar desde archivo (Excel o CSV)
#  2. Usar un conjunto de datos predefinido (caso de prueba)
#  3. Ingresar los datos manualmente
# El objetivo es construir un DataFrame (df_init_manual) con las alternativas y criterios
# que servirán como entrada al algoritmo de Abejas Artificiales (ABC).

print("Seleccione el tipo de entrada de datos:")
print("1. Cargar desde archivo (Excel .xlsx o CSV .csv)")
print("2. Usar un caso predefinido")
print("3. Ingresar datos manuales")

opcion = input("Opción (1/2/3): ")

# --- OPCIÓN 1: Lectura desde archivo externo ---
if opcion == "1":
    ruta = input("Ingrese el nombre o ruta del archivo: ")
    # Dependiendo del tipo de archivo, se usa read_csv o read_excel
    if ruta.lower().endswith(".csv"):
        df_init_manual = pd.read_csv(ruta, index_col=0)
    else:
        hoja = input("Ingrese el nombre de la hoja (por defecto 'Hoja 1'): ") or "Hoja 1"
        df_init_manual = pd.read_excel(ruta, sheet_name=hoja, index_col=0)
    print("\nDatos cargados desde archivo:")
    print(df_init_manual)

# --- OPCIÓN 2: Caso predefinido ---
elif opcion == "2":
    # Este caso contiene datos de prueba tomados de un estudio previo (Dra. Dynhora).
    # Cada alternativa (A1...A9) tiene valores asociados a varios criterios (C1...C5).
    candidates = np.array(["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"])
    predef = {
        'C1': [0.048, 0.053, 0.057, 0.062, 0.066, 0.070, 0.075, 0.079, 0.083],
        'C2': [0.047, 0.052, 0.057, 0.062, 0.066, 0.071, 0.075, 0.079, 0.083],
        'C3': [0.070, 0.066, 0.066, 0.063, 0.070, 0.066, 0.066, 0.066, 0.066],
        'C4': [0.087, 0.081, 0.076, 0.058, 0.085, 0.058, 0.047, 0.035, 0.051],
        'C5': [0.190, 0.058, 0.022, 0.007, 0.004, 0.003, 0.002, 0.002, 0.000]
    }
    df_init_manual = pd.DataFrame(predef, index=candidates)
    print("\nCaso predefinido cargado:")
    print(df_init_manual)

# --- OPCIÓN 3: Ingreso manual ---
else:
    # Permite ingresar los valores uno por uno desde el teclado.
    n_alt = int(input("Número de alternativas (A1,2,3..): "))
    n_crit = int(input("Número de criterios (C1,2,3...): "))

    candidatos = []
    datos = {}

    # Inicializa las columnas (criterios)
    for j in range(n_crit):
        datos[f"C{j+1}"] = []

    # Captura de valores para cada alternativa y criterio
    for i in range(n_alt):
        nombre = input(f"Nombre de la alternativa {i+1} (ej. A{i+1}): ")
        candidatos.append(nombre)
        for j in range(n_crit):
            val = float(input(f"Ingrese valor de {nombre} en C{j+1}: "))
            datos[f"C{j+1}"].append(val)

    df_init_manual = pd.DataFrame(datos, index=candidatos)
    print("\nDatos ingresados manualmente:")
    print(df_init_manual)


# ==========================================================
# SECCIÓN 2: DEFINICIÓN DE PARÁMETROS DEL ALGORITMO ABC
# ==========================================================
# Aquí se establecen los parámetros básicos del algoritmo Artificial Bee Colony.
# Estos determinan el número de fuentes de alimento, dimensiones, límites y
# número máximo de iteraciones.

candidates = df_init_manual.index.values  # Nombres dinámicos (A1, A2, etc.)
FoodSource = len(df_init_manual) * 2      # Fuentes de alimento = 2 * número de alternativas
D = df_init_manual.shape[1]               # Número de criterios (dimensiones del problema)
max_iter = 50                             # Número de iteraciones del ciclo de optimización
lb = np.array([0.0] * D)                  # Límite inferior (0 para cada criterio)
ub = np.array([1.0] * D)                  # Límite superior (1 para cada criterio)
N = len(df_init_manual)                   # Número de soluciones iniciales
limit = N * D                             # Límite de intentos antes de aplicar fase de “scout”
trial = np.zeros(N)                       # Contador de intentos fallidos
pos = df_init_manual.values.copy()        # Matriz de posiciones iniciales

# ==========================================================
# SECCIÓN 3: FUNCIONES OBJETIVO Y FITNESS
# ==========================================================
# fobj(X): calcula la función objetivo para cada solución.
# En este caso, se usa una función cuadrática simple (minimización de distancia a 0.05).
# calculate_fitness(): convierte los valores de fobj en "fitness", que representa
# la calidad relativa de cada fuente de alimento.

def fobj(X):
    # La función evalúa qué tan cerca está cada valor de 0.05.
    return np.sum((X - 0.05)**2, axis=1)

def calculate_fitness(fx):
    # Se transforma el valor del costo en una medida de aptitud (fitness).
    fit = np.zeros_like(fx)
    fit[fx >= 0] = 1 / (1 + fx[fx >= 0])
    fit[fx < 0] = 1 + np.abs(fx[fx < 0])
    return fit


# ==========================================================
# SECCIÓN 4: INICIO DEL PROCESO EVOLUTIVO
# ==========================================================
# Se registran los tiempos de ejecución y se inicializan las variables de evaluación.
# Luego comienza el ciclo principal del algoritmo (Employed, Onlooker, Scout).

start_time = datetime.now()

fx = fobj(pos)
fit = calculate_fitness(fx)

Fbest = []  # Guarda el mejor valor de la función objetivo en cada iteración
Xbest = []  # Guarda la posición correspondiente al mejor valor

# ==========================================================
# CICLO PRINCIPAL DEL ALGORITMO
# ==========================================================
for iter in range(max_iter):
    print(f"\n=== Iteración {iter+1} ===\n")

    # Mostrar el estado actual de las soluciones
    df_current = pd.DataFrame(pos, columns=[f"C{i+1}" for i in range(D)], index=candidates)
    df_current["f(x)"] = fx
    df_current["Fitness"] = fit
    df_current["Trial"] = trial.astype(int)
    print("Estado actual:")
    print(df_current)

    # ----------------------------------------------------------
    # FASE 1: EMPLOYED BEES (ABEJAS EMPLEADAS)
    # ----------------------------------------------------------
    # Cada abeja explora alrededor de su fuente actual buscando una mejor posición.
    # Si mejora su "nectar" (fitness), actualiza su fuente; si no, incrementa su contador de intentos.
    for i in range(N):
        p2c = np.random.randint(D)     # Criterio seleccionado al azar
        partner = np.random.randint(N) # Otra abeja seleccionada al azar
        while partner == i:            # Asegura que no se seleccione a sí misma
            partner = np.random.randint(N)

        # Generación de una nueva solución vecina
        X = pos[i, p2c]
        Xp = pos[partner, p2c]
        phi = (np.random.rand() - 0.5) * 2 * (X - Xp)
        Xnew_val = X + phi
        Xnew_val = np.clip(Xnew_val, lb[p2c], ub[p2c])  # Mantener dentro de los límites

        # Sustituye el valor modificado y evalúa la nueva solución
        Xnew = np.copy(pos[i])
        Xnew[p2c] = Xnew_val

        fnew = fobj(Xnew.reshape(1, -1))[0]
        new_fit = calculate_fitness(np.array([fnew]))[0]

        # Reemplazo si mejora
        if new_fit > fit[i]:
            pos[i] = Xnew
            fx[i] = fnew
            fit[i] = new_fit
            trial[i] = 0
        else:
            trial[i] += 1

    # ----------------------------------------------------------
    # FASE 2: ONLOOKER BEES (ABEJAS OBSERVADORAS)
    # ----------------------------------------------------------
    # Las abejas observadoras eligen fuentes según su probabilidad (fitness relativo)
    # y también exploran su vecindad buscando mejoras.
    prob = fit / np.sum(fit)
    for i in range(N):
        if np.random.rand() < prob[i]:
            p2c = np.random.randint(D)
            partner = np.random.randint(N)
            while partner == i:
                partner = np.random.randint(N)

            X = pos[i, p2c]
            Xp = pos[partner, p2c]
            phi = (np.random.rand() - 0.5) * 2 * (X - Xp)
            Xnew_val = X + phi
            Xnew_val = np.clip(Xnew_val, lb[p2c], ub[p2c])

            Xnew = np.copy(pos[i])
            Xnew[p2c] = Xnew_val

            fnew = fobj(Xnew.reshape(1, -1))[0]
            new_fit = calculate_fitness(np.array([fnew]))[0]

            if new_fit > fit[i]:
                pos[i] = Xnew
                fx[i] = fnew
                fit[i] = new_fit
                trial[i] = 0
            else:
                trial[i] += 1

    # ----------------------------------------------------------
    # FASE 3: SCOUT BEES (ABEJAS EXPLORADORAS)
    # ----------------------------------------------------------
    # Si una fuente de alimento no mejora tras muchos intentos (trial > limit),
    # la abeja se convierte en exploradora y busca una nueva fuente aleatoria.
    for i in range(N):
        if trial[i] > limit:
            pos[i] = np.random.uniform(lb, ub, D)
            fx[i] = fobj(pos[i].reshape(1, -1))[0]
            fit[i] = calculate_fitness(np.array([fx[i]]))[0]
            trial[i] = 0

    # ----------------------------------------------------------
    # REGISTRO DE RESULTADOS DE LA ITERACIÓN
    # ----------------------------------------------------------
    fbest = np.min(fx)
    ind = np.argmin(fx)
    Gbest = pos[ind]

    Fbest.append(fbest)
    Xbest.append(Gbest)

    print(f"\nMejor costo en esta iteración {iter+1}: {fbest:.6f}")


# ==========================================================
# SECCIÓN 5: RESULTADOS FINALES
# ==========================================================
# Una vez finalizadas las iteraciones, se muestra el resumen del rendimiento del algoritmo.

print("\nMejores soluciones por iteración:")
for i, (f, x) in enumerate(zip(Fbest, Xbest), 1):
    print(f"Iteración {i:2d} | Mejor f(x): {f:.6f} | Posición: {np.round(x, 4)}")

# Cálculo de tiempos y mejor solución
end_time = datetime.now()
elapsed_time = end_time - start_time

best_iter = np.argmin(Fbest)
best_value = Fbest[best_iter]
best_position = Xbest[best_iter]

# ----------------------------------------------------------
# RESUMEN FINAL DE LA EJECUCIÓN
# ----------------------------------------------------------
print("\n===== RESUMEN FINAL =====")
print("Algoritmo: ABC")
print(f"Cantidad de Iteraciones: {max_iter}")
print(f"Fecha de inicio: {start_time.strftime('%Y-%m-%d')}")
print(f"Hora de inicio: {start_time.strftime('%H:%M:%S')}")
print(f"Hora de finalización: {end_time.strftime('%H:%M:%S')}")
print(f"Tiempo de ejecución: {elapsed_time}")
print(f"Mejor posición = {np.round(best_position, 6)}")
print(f"Mejor óptimo = {best_value:.6f}")
print(f"La mejor alternativa: {candidates[np.argmin(fx)]} {np.round(best_position, 6)}")
