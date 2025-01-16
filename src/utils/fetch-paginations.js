import { db } from "../../firebase/config";
import {
  collection,
  doc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { getDatabase, ref, get } from "firebase/database";


const fetchRecommendedPlacesWithPagination = async (lastVisibleDoc = null) => {
  const placesRef = collection(db, "places");
  let q = query(placesRef, orderBy("rating",'desc'), limit(10));

  if (lastVisibleDoc) {
    q = query(q, startAfter(lastVisibleDoc));
  }

  const snapshot = await getDocs(q);

  if (!snapshot) {
    return { places: [], lastVisible: null };
  }

  const places = [];
  snapshot.forEach((childSnapshot) => {
    places.push({
      id: childSnapshot.id,
      ...childSnapshot.data(),
    });
  });

  const lastVisible = places[places.length - 1]?.id;
  return { places, lastVisible };
};

const fetchPlacesWithPagination = async (lastVisibleDoc = null) => {
  const placesRef = collection(db, "places");
  let q = query(placesRef, limit(10));

  if (lastVisibleDoc) {
    q = query(q, startAfter(lastVisibleDoc));
  }

  const snapshot = await getDocs(q);


  if (!snapshot) {
    return { places: [], lastVisible: null };
  }

  const places = [];
  snapshot.forEach((childSnapshot) => {
    places.push({
      id: childSnapshot.id,
      ...childSnapshot.data(),
    });
  });

  const lastVisible = places[places.length - 1]?.id;
  return { places, lastVisible };
};

async function getLastFeedsPagination(lastVisible = null) {
  // Reference to the 'feeds' collection
  const feedsRef = collection(db, "feeds");

  // Create the query
  const feedsQuery = lastVisible
    ? query(
        feedsRef,
        orderBy("createdAt",'desc'), // Order by 'createdAt'
        startAfter(lastVisible.createdAt), // Start after the last visible document
        limit(2) // Limit to 3 documents
      )
    : query(feedsRef, orderBy("createdAt",'desc'), limit(2)); // Default query


  // Fetch data
  const snapshot = await getDocs(feedsQuery);
  if (!snapshot.empty) {
    // Map the documents to an array
    const feedsArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get the last visible document
    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

    return {
      feedsArray,
      lastVisible: lastVisibleDoc, // Return the last visible document
    };
  }

  // Return empty results if no data is found
  return {
    feedsArray: [],
    lastVisible: null,
  };
}

const fetchPlacesByCategory = async (
  categories = [],
  lastVisibleDoc = null
) => {
  const placesRef = collection(db, "places");

  let q = query(placesRef, orderBy("rating",'desc'));

  if (lastVisibleDoc) {
    q = query(q, startAfter(lastVisibleDoc));
  }

  const snapshot = await getDocs(q);

  if (!snapshot) {
    return { places: [], lastVisible: null };
  }

  const places = [];
  snapshot.forEach((childSnapshot) => {
    places.push({
      id: childSnapshot.id,
      ...childSnapshot.data(),
    });
  });

  const filteredPlaces = places.filter((place) =>
    categories.includes(place.category)
  );

  const lastVisible =
    filteredPlaces.length > 0
      ? filteredPlaces[filteredPlaces.length - 1]?.id
      : null;
  return { places: filteredPlaces, lastVisible };
};





 const fetchCategories = async () => {
  try {
    const db = getDatabase();
    const dbRef = ref(db, "sections");

    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("Данные не найдены!");
      return [];
    }
  } catch (error) {
    console.error("Ошибка при получении данных: ", error);
    return [];
  }
};




// const fetchPlacesByCategory = async (categories = [], lastVisibleKey = null) => {
//   try {
//     const db = getDatabase();
//     const dbRef = ref(db, "articles"); // Ссылка на "articles"
//
//     // Получаем все данные из базы
//     const snapshot = await get(dbRef);
//
//     if (!snapshot.exists()) {
//       console.log("Данные не найдены!");
//       return { places: [], lastVisible: null };
//     }
//
//     // Преобразуем snapshot в массив объектов
//     const places = [];
//     snapshot.forEach((childSnapshot) => {
//       places.push({
//         id: childSnapshot.key, // Уникальный ключ записи
//         ...childSnapshot.val(), // Все данные записи
//       });
//     });
//
//     console.log("Все данные:", places);
//
//     // Фильтрация по категориям
//     const filteredPlaces = places.filter((place) =>
//         categories.length === 0 || categories.includes(place.category)
//     );
//
//     console.log("Отфильтрованные данные:", filteredPlaces);
//
//     // Сортировка по рейтингу (desc)
//     const sortedPlaces = filteredPlaces.sort((a, b) => b.rating - a.rating);
//
//     // Если есть lastVisibleKey, применяем пагинацию
//     const startIndex = lastVisibleKey
//         ? sortedPlaces.findIndex((place) => place.id === lastVisibleKey) + 1
//         : 0;
//
//     const paginatedPlaces = sortedPlaces.slice(startIndex, startIndex + 10); // Возвращаем максимум 10 записей
//
//     // Определяем последний видимый элемент
//     const lastVisible =
//         paginatedPlaces.length > 0
//             ? paginatedPlaces[paginatedPlaces.length - 1]?.id
//             : null;
//
//     return { places: paginatedPlaces, lastVisible };
//   } catch (error) {
//     console.error("Ошибка при получении данных: ", error);
//     return { places: [], lastVisible: null };
//   }
// };

// Использование функции
// fetchPlacesByCategory(["hotel", "restaurant"]).then(({ places, lastVisible }) => {
//   console.log("Результат:", places);
//   console.log("Последний элемент:", lastVisible);
// });


const fetchAllPlaces = async () => {
  try {
    const db = getDatabase();
    const dbRef = ref(db, "articles"); // Укажите путь к данным

    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
      console.log("Данные не найдены!");
      return [];
    }

    const places = [];
    snapshot.forEach((childSnapshot) => {
      places.push({
        id: childSnapshot.key, // Firebase key как ID
        ...childSnapshot.val(), // Данные элемента
      });
    });

    console.log("Полученные данные:", places);
    return places;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return [];
  }
};



const fetchCollections = async () => {
  try {
    const db = getDatabase(); // Инициализация базы данных
    const dbRef = ref(db, "collections"); // Путь к коллекции "collections"

    console.log("Запрос данных из Firebase...");

    const snapshot = await get(dbRef); // Получаем данные

    if (!snapshot.exists()) {
      console.log("Данные не найдены!");
      return [];
    }

    // Преобразуем данные из snapshot в массив
    const collections = [];
    snapshot.forEach((childSnapshot) => {
      collections.push({
        id: childSnapshot.key, // Используем key как уникальный id
        ...childSnapshot.val(), // Добавляем остальные данные
      });
    });

    return collections;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return [];
  }
};

//
// fetchCollections().then((collections) => {
//   console.log("Результат:", collections);
// });

export {
  fetchPlacesWithPagination,
  fetchRecommendedPlacesWithPagination,
  getLastFeedsPagination,
  fetchCollections,
  fetchPlacesByCategory,
  fetchAllPlaces,
  fetchCategories
};
