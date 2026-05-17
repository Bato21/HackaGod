// AUTO-GENERADO desde hojas de justificación del Excel de respaldo.
// Fuente: PRESIDENTES_..._INDICADORES_INFLACION.xlsx
window.METHODOLOGY = {
 "fuentes": [
  [
   "Variable",
   "Medición en la base",
   "Fuente usada / criterio",
   "URL"
  ],
  [
   "Aprobación del gobierno (%)",
   "Porcentaje. Se usa promedio anual cuando hay dato país-año; si no existe promedio anual, se usa una medición respaldada del mandato/gobierno como dato referencial. Las filas sin fuente pública confiable quedan como “Sin dato respaldado”.",
   "Cadem para Chile; Gallup para Estados Unidos; Executive Approval Project como referencia global; listado internacional de aprobación ejecutiva con fuentes nacionales y Afrobarometer/Gallup/encuestadoras según país.",
   "https://cadem.cl/plaza-publica/ ; https://news.gallup.com/poll/116479/barack-obama-presidential-job-approval.aspx ; https://executiveapproval.org/ ; https://en.wikipedia.org/wiki/List_of_heads_of_the_executive_by_approval_rating"
  ],
  [
   "Índice de pobreza (% población)",
   "Porcentaje de población bajo la línea nacional de pobreza.",
   "World Development Indicators / Banco Mundial, indicador SI.POV.NAHC.",
   "https://data.worldbank.org/indicator/SI.POV.NAHC"
  ],
  [
   "Tasa de homicidios por cada 100.000 habitantes",
   "Homicidios intencionales por cada 100.000 habitantes.",
   "World Development Indicators / Banco Mundial, indicador VC.IHR.PSRC.P5; fuente original UNODC.",
   "https://data.worldbank.org/indicator/VC.IHR.PSRC.P5"
  ],
  [
   "PIB: crecimiento anual (%)",
   "Crecimiento anual del PIB real en porcentaje. No es PIB absoluto.",
   "World Development Indicators / Banco Mundial, indicador NY.GDP.MKTP.KD.ZG.",
   "https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG"
  ],
  [
   "Comentario PIB",
   "Clasificación interpretativa según crecimiento anual: negativo=malo; 0 a 2=bajo; 2 a 5=bueno/moderado; mayor a 5=muy bueno.",
   "Criterio analítico para dashboard, calculado desde el crecimiento anual del PIB.",
   "Elaboración propia con base en NY.GDP.MKTP.KD.ZG"
  ],
  [
   "Postura política",
   "Clasificación izquierda/centro/derecha/no clasificado cuando existe codificación comparable.",
   "Database of Political Institutions 2023 y codificación política disponible hasta 2023; para 2024-2025 se mantiene solo cuando es defendible por continuidad del mandatario/partido.",
   "https://data.iadb.org/dataset/the-database-of-political-institutions-dpi-2023"
  ],
  [
   "Presidente / líder en ese año",
   "Autoridad máxima del ejecutivo o jefe de Estado/Gobierno según sistema político; cuando hubo cambio dentro del año se dejaron ambos nombres separados por /.",
   "Listas públicas de jefes de Estado y Gobierno por año; revisión manual para países que aparecían como “Sin presidente en base”.",
   "https://en.wikipedia.org/wiki/Lists_of_state_leaders ; https://en.wikipedia.org/wiki/List_of_current_heads_of_state_and_government"
  ],
  [
   "Nota de cobertura de aprobación",
   "Se aumentó la cobertura usando aprobación anual cuando existe y aprobación de mandato/medición representativa cuando no existe serie anual.",
   "No se inventaron porcentajes para países sin fuente pública ubicable."
  ],
  [
   "Celdas con aprobación numérica",
   "383",
   "Incluye datos anuales y de mandato/referencia."
  ],
  [
   "Celdas con aprobación anual exacta",
   "16",
   "Principalmente Chile y Estados Unidos."
  ],
  [
   "Celdas con aprobación de mandato/referencia",
   "367",
   "Mediciones públicas de aprobación usadas como referencia del gobierno/mandato."
  ],
  [
   "Gabinete - Economía",
   "Nombre del ministro/a del área económica por país-año cuando exista fuente oficial o verificable.",
   "No se rellenó con nombres no verificados. Para una base defendible, el gabinete debe recopilarse por país-año desde sitios oficiales de gobierno, parlamentos, anuarios oficiales o Wikidata con cargo y fechas.",
   "https://www.wikidata.org/"
  ],
  [
   "Gabinete - Salud",
   "Nombre del ministro/a de salud por país-año cuando exista fuente oficial o verificable.",
   "No se rellenó con nombres no verificados. Se recomienda cargar fuente oficial por país para completar masivamente.",
   "https://www.wikidata.org/"
  ],
  [
   "Gabinete - Vivienda",
   "Nombre del ministro/a de vivienda/urbanismo/desarrollo territorial por país-año cuando exista cargo equivalente.",
   "Algunos países no tienen ministerio de vivienda independiente; se debe usar el cargo equivalente y respaldarlo.",
   "https://www.wikidata.org/"
  ],
  [
   "Gabinete - Transporte",
   "Nombre del ministro/a de transporte/infraestructura por país-año cuando exista cargo equivalente.",
   "Algunos países integran transporte con obras públicas o infraestructura; se debe usar equivalente respaldado.",
   "https://www.wikidata.org/"
  ],
  [
   "Gabinete - Trabajo",
   "Nombre del ministro/a de trabajo/empleo por país-año cuando exista cargo equivalente.",
   "No se rellenó con nombres no verificados.",
   "https://www.wikidata.org/"
  ],
  [
   "Gabinete - Justicia",
   "Nombre del ministro/a de justicia por país-año cuando exista cargo equivalente.",
   "No se rellenó con nombres no verificados.",
   "https://www.wikidata.org/"
  ],
  [
   "Nota gabinete",
   "Las seis columnas se agregaron en la hoja principal para conectar con el dashboard.",
   "Las celdas quedan como 'Sin dato respaldado' cuando no hay verificación. Es preferible a usar nombres falsos."
  ],
  [
   "Variable",
   "Fuente",
   "Criterio usado",
   "URL"
  ],
  [
   "Gabinete 2017-2019",
   "CIA World Leaders / Chiefs of State and Cabinet Members of Foreign Governments",
   "Se usó el directorio de julio de cada año para asignar ministros por cartera. Cuando no existe cartera exacta, se asignó el equivalente funcional más cercano: Economía/Finanzas, Vivienda/Ciudades/Obras Públicas, Transporte/Infraestructura, Trabajo/Empleo, Salud y Justicia.",
   "https://www.cia.gov/resources/world-leaders/historical-data/"
  ],
  [
   "Gabinete 2023-2025 Brasil",
   "CIA World Leaders + gobierno de Brasil",
   "Se completó Brasil 2023-2025 para que el dashboard de ejemplo tenga ministros reales. En años con cambios durante el año se usó el ministro vigente o representativo del periodo.",
   "https://www.cia.gov/resources/world-leaders/foreign-governments/brazil"
  ],
  [
   "Nota metodológica",
   "Cobertura",
   "Los ministros 2017-2019 tienen cobertura amplia con fuente CIA. Para otros años/países se mantiene 'Sin dato respaldado' cuando no hay fuente verificable en la base usada; no se inventan nombres."
  ],
  [
   "Gabinete Chile 2020-2025",
   "Fuentes públicas de gabinetes de Sebastián Piñera y Gabriel Boric",
   "Se completaron los 6 ministerios pedidos para Chile. Cuando hubo cambio dentro del año, se dejó más de un nombre separado por /.",
   "https://www.sebastianpinera.cl/equipo-ministerial-2018-2022/ ; https://es.wikipedia.org/wiki/Anexo:Gabinetes_ministeriales_del_segundo_gobierno_de_Sebasti%C3%A1n_Pi%C3%B1era ; https://es.wikipedia.org/wiki/Anexo:Gabinetes_ministeriales_del_gobierno_de_Gabriel_Boric ; https://prensa.presidencia.cl/comunicado.aspx?id=302568"
  ],
  [
   "Criterio gabinete anual",
   "Ministro representativo del año",
   "Si un cargo cambió dentro del año, se incluyeron ambos nombres para no ocultar el cambio.",
   "Elaboración propia con fuentes públicas"
  ],
  [
   "Pendientes gabinete mundial 2020-2025",
   "Cobertura global",
   "La base CIA 2017-2019 se completó ampliamente. Para 2020-2025 se debe seguir agregando por país con fuente verificable; no se reemplaza con nombres falsos.",
   "https://www.cia.gov/resources/world-leaders/historical-data/"
  ],
  [
   "Gabinete - criterio de completitud",
   "Nombres de ministros/as para Economía, Salud, Vivienda, Transporte, Trabajo y Justicia. Se prioriza CIA World Leaders / Chiefs of State and Cabinet Members, páginas oficiales de gobierno y gabinetes históricos. Si no hay fuente verificada, no se inventa el nombre.",
   "CIA World Leaders / Historical Data",
   "https://www.cia.gov/resources/world-leaders/historical-data/"
  ],
  [
   "Gabinete - nota metodológica",
   "Para años con cambios dentro del mismo año, la celda puede contener dos nombres separados por /. Para países donde el cargo está fusionado con otro ministerio, se mantiene el cargo equivalente entre paréntesis.",
   "Criterio de equivalencia ministerial",
   "https://www.cia.gov/resources/world-leaders/"
  ],
  [
   "Actualización realizada",
   "Gabinete Javier Milei e hitos por país-año",
   "Se corrigieron ministros faltantes de Javier Milei y se añadieron 8 columnas de hitos por cada fila país-año.",
   "2026-05-17"
  ],
  [
   "Criterio de hitos",
   "Hitos comparables por fila",
   "Los hitos se generaron con datos ya presentes en la base: presidente/líder, PIB, pobreza, homicidios, gabinete, postura política y contexto anual.",
   "2026-05-17"
  ],
  [
   "Fuente Argentina oficial",
   "Bitácora de gestión / Gobierno argentino",
   "https://www.argentina.gob.ar/bitacora",
   "Consulta 2026-05-17"
  ],
  [
   "Fuente Argentina estructura ministerial",
   "Gobierno argentino / normativa y páginas oficiales",
   "https://www.argentina.gob.ar/",
   "Consulta 2026-05-17"
  ],
  [
   "Fuente complementaria gabinete Milei",
   "Wikipedia: Ministry of Infrastructure (Argentina), Guillermo Ferraro, Mariano Cúneo Libarona; Reuters/AP para cambios posteriores.",
   "https://en.wikipedia.org/wiki/Ministry_of_Infrastructure_(Argentina)",
   "Consulta 2026-05-17"
  ],
  [
   "Fuente / criterio gabinete completo",
   "URL",
   "Uso",
   "Notas"
  ],
  [
   "CIA World Leaders",
   "https://www.cia.gov/resources/world-leaders/",
   "Fuente principal de referencia para jefes de Estado y miembros de gabinete.",
   "La CIA indica que publica y actualiza el directorio de World Leaders and Cabinet Members semanalmente."
  ],
  [
   "CIA World Leaders Historical Data",
   "https://www.cia.gov/resources/world-leaders/historical-data/",
   "Fuente histórica para gabinetes por mes/año.",
   "La página agrupa datos históricos de 24 años; se usó como criterio base para la estructura del gabinete."
  ],
  [
   "Criterio de continuidad",
   "",
   "Cuando el país-año no tenía una celda ministerial, se completó con el ministro más cercano del mismo país y, cuando fue posible, del mismo presidente/líder.",
   "Este criterio evita dejar celdas vacías en años sin publicación anual consolidada."
  ],
  [
   "Criterio de equivalencia ministerial",
   "",
   "En países sin 'Ministro de Economía' literal se usó la autoridad equivalente: Finanzas, Hacienda, Treasury, Treasurer o planificación económica.",
   "Ejemplos: Estados Unidos usa Secretaries; Australia usa Treasurer; México usa SHCP."
  ],
  [
   "Cartera no individualizada",
   "",
   "Cuando no existe ministerio nacional único o la fuente no individualiza la cartera, se dejó expresamente el criterio de equivalencia/no individualización.",
   "Esto es más defendible que inventar un nombre sin respaldo."
  ],
  [
   "Indicadores judiciales / anticorrupción",
   "Criterio de completado",
   "No se asignan números sin fuente oficial país-año verificable; cuando no existe dato público comparable se usa 'Sin dato público comparable'.",
   "2026-05-17"
  ],
  [
   "Indicadores judiciales / anticorrupción",
   "Fuentes a consultar",
   "UIF/UAF/UIAF nacional, Fiscalía/Ministerio Público, Poder Judicial, Contraloría, Consejo/Instituto de Transparencia y reportes anuales oficiales.",
   "2026-05-17"
  ],
  [
   "Inflación anual (%)",
   "World Bank / IMF via Our World in Data",
   "Indicador FP.CPI.TOTL.ZG; annual %",
   "Se agregaron columnas AG:AI con valor numérico cuando hay dato comparable 2017-2024; 2025 queda sin dato anual oficial publicado en la fuente."
  ]
 ],
 "guia_indicadores": [
  [
   "Guía de indicadores numéricos",
   "",
   "",
   "",
   "",
   ""
  ],
  [
   "Tipo de dato",
   "Indicador proxy / estimado para visualización",
   "",
   "",
   "",
   ""
  ],
  [
   "Advertencia metodológica",
   "Los valores no corresponden a cifras oficiales judiciales o administrativas. Se calcularon para evitar números ficticios sin criterio y permitir visualización en Power BI con una regla reproducible.",
   "",
   "",
   "",
   ""
  ],
  [
   "Variable",
   "Qué representa en el dashboard",
   "Base de cálculo usada",
   "Formato",
   "Uso recomendado",
   "Limitación"
  ],
  [
   "Reportes UIF / unidad equivalente",
   "Intensidad estimada de reportes financieros sospechosos o actividad antilavado",
   "PIB negativo, pobreza, homicidios, aprobación y palabras clave de corrupción/investigación en hitos",
   "Número entero",
   "Comparar intensidad relativa entre país-año",
   "No es conteo oficial UIF"
  ],
  [
   "Sentencias firmes",
   "Actividad judicial cerrada estimada",
   "Palabras clave judiciales, corrupción y riesgo general del año",
   "Número entero",
   "Indicador comparativo de resultados judiciales",
   "No es conteo oficial de tribunales"
  ],
  [
   "Acceso a información negado",
   "Restricción estimada de transparencia/acceso a información",
   "Palabras clave de transparencia/censura, protestas, aprobación y riesgo general",
   "Número entero",
   "Medir presión institucional relativa",
   "No es conteo oficial de solicitudes rechazadas"
  ],
  [
   "Allanamientos u operativos",
   "Actividad operativa estimada de seguridad/investigación",
   "Tasa de homicidios, palabras clave de seguridad, protestas e investigación",
   "Número entero",
   "Comparar años con mayor presión operativa",
   "No es conteo oficial policial/judicial"
  ],
  [
   "Casos judiciales abiertos",
   "Carga judicial/investigativa estimada",
   "Corrupción, justicia, protestas y riesgo país-año",
   "Número entero",
   "Usar como indicador central de actividad institucional",
   "No es conteo oficial de causas"
  ],
  [
   "Imputaciones / formalizaciones",
   "Personas o procedimientos acusatorios estimados",
   "Proporción de casos abiertos más palabras clave judiciales/corrupción",
   "Número entero",
   "Comparar intensidad acusatoria relativa",
   "No es conteo oficial de imputados"
  ],
  [
   "Casos de corrupción relevantes",
   "Eventos de corrupción o investigación relevante detectados en hitos",
   "Palabras clave de corrupción e investigación en los hitos",
   "Número entero",
   "Complementar el análisis político-institucional",
   "Depende del detalle de los hitos"
  ],
  [
   "Cómo defenderlo",
   "Presentar estos campos como indicadores proxy comparativos, no como datos oficiales. Para un informe final, indicar que se usan para visualización exploratoria y que deben reemplazarse por fuentes oficiales país-año si se requiere precisión legal.",
   "",
   "",
   "",
   ""
  ]
 ],
 "cobertura_gabinete": [
  [
   "Año",
   "Países en base",
   "Economía completos",
   "Salud completos",
   "Vivienda completos",
   "Transporte completos",
   "Trabajo completos",
   "Justicia completos",
   "% gabinete completo (promedio 6 cargos)"
  ],
  [
   "2017",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "100"
  ],
  [
   "2018",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "100"
  ],
  [
   "2019",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "100"
  ],
  [
   "2020",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "100"
  ],
  [
   "2021",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "100"
  ],
  [
   "2022",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "100"
  ],
  [
   "2023",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "100"
  ],
  [
   "2024",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "100"
  ],
  [
   "2025",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "184",
   "100"
  ],
  [
   "Actualización gabinete completo",
   "Se eliminaron los 'Sin dato respaldado' de J:O. Celdas se completaron por dato explícito, continuidad por país/presidente, equivalente ministerial, o criterio de cartera no individualizada. Ver columna X."
  ]
 ],
 "guia_inflacion": [
  [
   "Campo",
   "Descripción",
   "Fuente / criterio",
   "Nota"
  ],
  [
   "Inflación anual (%)",
   "Variación anual del índice de precios al consumidor, en porcentaje.",
   "World Bank / IMF International Financial Statistics vía Our World in Data, indicador FP.CPI.TOTL.ZG.",
   "Dato comparable internacionalmente."
  ],
  [
   "Cobertura",
   "Se completan datos disponibles 2017-2024 cuando aparecen en la fuente comparable.",
   "La fuente consultada disponible públicamente llega hasta 2024.",
   "Para 2025 se deja en blanco si no existe dato anual comparable publicado."
  ],
  [
   "País-año sin dato",
   "Celdas en blanco indican que no se encontró dato público comparable en la fuente usada.",
   "No se reemplazó por estimaciones para evitar números ficticios.",
   "Power BI puede tratar estos valores como nulos."
  ],
  [
   "Fuente",
   "https://ourworldindata.org/grapher/inflation-of-consumer-prices",
   "https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG",
   "Inflación anual, precios al consumidor (%)"
  ],
  [
   "Última revisión",
   "2026-05-17",
   "Revisión realizada para esta base",
   ""
  ]
 ],
 "cobertura_inflacion": [
  [
   "Año",
   "Filas totales",
   "Con inflación numérica",
   "Sin dato numérico"
  ],
  [
   "2017",
   "184",
   "168",
   "16"
  ],
  [
   "2018",
   "184",
   "170",
   "14"
  ],
  [
   "2019",
   "184",
   "170",
   "14"
  ],
  [
   "2020",
   "184",
   "173",
   "11"
  ],
  [
   "2021",
   "184",
   "173",
   "11"
  ],
  [
   "2022",
   "184",
   "173",
   "11"
  ],
  [
   "2023",
   "184",
   "176",
   "8"
  ],
  [
   "2024",
   "184",
   "176",
   "8"
  ],
  [
   "2025",
   "184",
   "0",
   "184"
  ],
  [
   "Países con faltantes 2017-2024 en fuente usada",
   "",
   "",
   ""
  ],
  [
   "Barbados",
   "2017",
   "",
   ""
  ],
  [
   "Comoros",
   "2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024",
   "",
   ""
  ],
  [
   "Cuba",
   "2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024",
   "",
   ""
  ],
  [
   "Democratic Republic of the Congo",
   "2017, 2018, 2019, 2020, 2021, 2022",
   "",
   ""
  ],
  [
   "Eritrea",
   "2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024",
   "",
   ""
  ],
  [
   "Eswatini",
   "2017, 2018, 2019",
   "",
   ""
  ],
  [
   "Myanmar",
   "2017, 2018, 2019",
   "",
   ""
  ],
  [
   "North Korea",
   "2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024",
   "",
   ""
  ],
  [
   "Russia",
   "2017",
   "",
   ""
  ],
  [
   "Somalia",
   "2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024",
   "",
   ""
  ],
  [
   "Syria",
   "2017, 2018, 2019",
   "",
   ""
  ],
  [
   "Taiwan",
   "2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024",
   "",
   ""
  ],
  [
   "Tajikistan",
   "2017, 2018, 2019, 2020, 2021, 2022",
   "",
   ""
  ],
  [
   "Turkmenistan",
   "2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024",
   "",
   ""
  ],
  [
   "Venezuela",
   "2017, 2018, 2019, 2020, 2021, 2022",
   "",
   ""
  ],
  [
   "Yemen",
   "2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024",
   "",
   ""
  ]
 ]
};
