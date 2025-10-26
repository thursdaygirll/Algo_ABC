# Tesis de licenciatura (Algoritmo ABC)
# Anette Angélica Juárez Sánchez
# Co-Asesora: Dr.Dynhora Danheyda Ramírez Ochoa
# Asesor: Dr. Luis Pérez-Domínguez
# Universidad Autónoma de Ciudad Juárez
# Inicio: 05/06/2025 Última modificación: / /2025

import numpy as np
import pandas as pd
from datetime import datetime

# SELECCIÓN DE DATOS

print("Seleccione el tipo de entrada de datos:")
print("1. Cargar desde archivo (Excel .xlsx o CSV .csv)")
print("2. Usar un caso predefinido")
print("3. Ingresar datos manuales")

opcion = input("Opción (1/2/3): ")

if opcion == "1":
    ruta = input("Ingrese el nombre o ruta del archivo: ")
    if ruta.lower().endswith(".csv"):
        df_init_manual = pd.read_csv(ruta, index_col=0)
    else:
        hoja = input("Ingrese el nombre de la hoja (por defecto 'Hoja 1'): ") or "Hoja 1"
        df_init_manual = pd.read_excel(ruta, sheet_name=hoja, index_col=0)
    print("\nDatos cargados desde archivo:")
    print(df_init_manual)

elif opcion == "2":
    # Caso predefinido (DATOS DEL AD-PSO, DRA.DYNHORA)
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

else:
    # Ingreso manual
    n_alt = int(input("Número de alternativas (A1,2,3..): "))
    n_crit = int(input("Número de criterios (C1,2,3...): "))

    candidatos = []
    datos = {}

    for j in range(n_crit):
        datos[f"C{j+1}"] = []

    for i in range(n_alt):
        nombre = input(f"Nombre de la alternativa {i+1} (ej. A{i+1}): ")
        candidatos.append(nombre)
        for j in range(n_crit):
            val = float(input(f"Ingrese valor de {nombre} en C{j+1}: "))
            datos[f"C{j+1}"].append(val)

    df_init_manual = pd.DataFrame(datos, index=candidatos)
    print("\nDatos ingresados manualmente:")
    print(df_init_manual)

# DEFINICIONES DEL ALGORITMO ABC

candidates = df_init_manual.index.values  # nombres dinámicos
FoodSource = len(df_init_manual) * 2
D = df_init_manual.shape[1]
max_iter = 50
lb = np.array([0.0] * D)
ub = np.array([1.0] * D)
N = len(df_init_manual)
limit = N * D
trial = np.zeros(N)
pos = df_init_manual.values.copy()

# Funciones objetivo y fitness
def fobj(X):
    return np.sum((X - 0.05)**2, axis=1)

def calculate_fitness(fx):
    fit = np.zeros_like(fx)
    fit[fx >= 0] = 1 / (1 + fx[fx >= 0])
    fit[fx < 0] = 1 + np.abs(fx[fx < 0])
    return fit

# INICIO DEL PROCESO

start_time = datetime.now()

fx = fobj(pos)
fit = calculate_fitness(fx)

Fbest = []
Xbest = []

for iter in range(max_iter):
    print(f"\n=== Iteración {iter+1} ===\n")

    df_current = pd.DataFrame(pos, columns=[f"C{i+1}" for i in range(D)], index=candidates)
    df_current["f(x)"] = fx
    df_current["Fitness"] = fit
    df_current["Trial"] = trial.astype(int)
    print("Estado actual:")
    print(df_current)

    # EMPLOYED BEE PHASE
    for i in range(N):
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

    # ONLOOKER BEE PHASE
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

    # SCOUT BEE PHASE
    for i in range(N):
        if trial[i] > limit:
            pos[i] = np.random.uniform(lb, ub, D)
            fx[i] = fobj(pos[i].reshape(1, -1))[0]
            fit[i] = calculate_fitness(np.array([fx[i]]))[0]
            trial[i] = 0

    fbest = np.min(fx)
    ind = np.argmin(fx)
    Gbest = pos[ind]

    Fbest.append(fbest)
    Xbest.append(Gbest)

    print(f"\nMejor costo en esta iteración {iter+1}: {fbest:.6f}")

print("\nMejores soluciones por iteración:")
for i, (f, x) in enumerate(zip(Fbest, Xbest), 1):
    print(f"Iteración {i:2d} | Mejor f(x): {f:.6f} | Posición: {np.round(x, 4)}")


# Riempos, posiciones, alternativas
end_time = datetime.now()
elapsed_time = end_time - start_time

best_iter = np.argmin(Fbest)
best_value = Fbest[best_iter]
best_position = Xbest[best_iter]

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
