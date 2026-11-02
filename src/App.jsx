
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";
import "./App-auth-styles.css";
import logo from "./assets/logo.jpg";
const CATEGORIES = [
  { value: "all", label: "Tous les logements" },
  { value: "studio", label: "Studios" },
  { value: "appartement", label: "Appartements" },
  { value: "maison", label: "Maisons" },
  { value: "chambre", label: "Chambres" },
];


async function addWatermark(file, watermarkText) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Impossible de lire la photo."));
    reader.onload = () => {
      image.onerror = () => reject(new Error("Format de photo invalide."));
      image.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;

          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Impossible de traiter la photo.");

          ctx.drawImage(image, 0, 0);

          const fontSize = Math.max(18, Math.round(canvas.width * 0.035));
          const padding = Math.round(fontSize * 0.6);

          ctx.font = `bold ${fontSize}px Arial`;
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";

          const text = watermarkText || "EazyHome";
          const x = canvas.width - padding;
          const y = canvas.height - padding;

          ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
          ctx.fillText(text, x + 2, y + 2);

          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.fillText(text, x, y);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Impossible de créer la photo filigranée."));
                return;
              }

              resolve(
                new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
            },
            "image/jpeg",
            0.92
          );
        } catch (error) {
          reject(error);
        }
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR").format(Number(price) || 0) + " FCFA";

const getInitials = (name = "EazyHome") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

function Avatar({ name, src, size = "normal" }) {
  return (
    <div className={`avatar avatar-${size}`}>
      {src ? (
        <img src={src} alt={`Profil de ${name || "l'utilisateur"}`} />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}

function Icon({ name }) {
  const paths = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9M9 20v-7h6v7" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    message: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
      </>
    ),
    bed: (
      <>
        <path d="M3 18v-7h18v7M3 14h18M5 11V6h6a3 3 0 0 1 3 3v2" />
        <path d="M3 18v3M21 18v3" />
      </>
    ),
    
settings: (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="m19.4 15 .1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.3a2 2 0 1 1-4 0v-.2a2 2 0 0 0-3.4-1.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A2 2 0 0 0 1.6 12a2 2 0 1 1 0-4h.2a2 2 0 0 0 1.4-3.4l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A2 2 0 0 0 9.4.4V.2a2 2 0 1 1 4 0v.2a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A2 2 0 0 0 21.1 8h.2a2 2 0 1 1 0 4h-.2a2 2 0 0 0-1.7 3Z" />
  </>
),

    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  };

  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.home}
    </svg>
  );
}
const TRANSLATIONS = {
  "Chargement de votre espace...": "Loading your space...",
  "La maison, plus simplement.": "Housing, made simpler.",
  "Découvre des logements, publie tes annonces et échange avec la communauté immobilière.": "Discover homes, publish listings, and connect with the real estate community.",
  "Des annonces centralisées": "Centralized listings",
  "Un espace pour bailleurs et locataires": "A space for landlords and tenants",
  "Une recherche adaptée à tes besoins": "Search tailored to your needs",
  "Connexion": "Log in",
  "Créer un compte": "Create an account",
  "Connecte-toi pour accéder au fil d'actualité.": "Log in to access the news feed.",
  "Rejoins la communauté EazyHome.": "Join the EazyHome community.",
  "Nom complet": "Full name",
  "Je suis": "I am",
  "Locataire": "Tenant",
  "Bailleur": "Landlord",
  "Adresse e-mail": "Email address",
  "Mot de passe": "Password",
  "Patiente...": "Please wait...",
  "Se connecter": "Log in",
  "Créer mon compte": "Create my account",
  "Tu n'as pas encore de compte ?": "Don't have an account yet?",
  "Tu as déjà un compte ?": "Already have an account?",
  "Inscris-toi": "Sign up",
  "Connecte-toi": "Log in",
  "Accueil": "Home",
  "Notifications": "Notifications",
  "Messagerie": "Messages",
  "Profil": "Profile",
  "Paramètres": "Settings",
  "Favoris": "Favorites",
  "Mes favoris": "My favorites",
  "Mes annonces": "My listings",
  "Menu": "Menu",
  "La maison facile": "Housing made easy",
  "Déconnexion": "Log out",
  "Rechercher un logement...": "Search for a property...",
  "Publier": "Publish",
  "Fil d’actualité": "News feed",
  "Les logements publiés sur EazyHome.": "Properties listed on EazyHome.",
  "BIENVENUE SUR EAZYHOME": "WELCOME TO EAZYHOME",
  "Trouve ton prochain chez-toi.": "Find your next home.",
  "Explore les annonces et affine ta recherche.": "Explore listings and refine your search.",
  "Publier une annonce immobilière...": "Publish a property listing...",
  "Logement": "Property",
  "Créer une annonce": "Create a listing",
  "Nouvelle annonce": "New listing",
  "Présente clairement le logement à louer.": "Describe the property clearly.",
  "Titre de l’annonce *": "Listing title *",
  "Prix mensuel en FCFA *": "Monthly price in XAF *",
  "Type de logement": "Property type",
  "Studio": "Studio",
  "Appartement": "Apartment",
  "Maison": "House",
  "Chambre": "Room",
  "Ville *": "City *",
  "Nombre de chambres": "Number of bedrooms",
  "Quartier / adresse": "Neighborhood / address",
  "Photos du logement (5 maximum)": "Property photos (maximum 5)",
  "Formats acceptés : JPG, PNG et WebP. Taille maximale :": "Accepted formats: JPG, PNG and WebP. Maximum size:",
  "Ou lien direct vers une photo existante": "Or direct link to an existing photo",
  "Description du logement": "Property description",
  "Annuler": "Cancel",
  "Publier l’annonce": "Publish listing",
  "Envoi des photos et publication...": "Uploading photos and publishing...",
  "Filtre les résultats selon tes critères.": "Filter results according to your criteria.",
  "Réinitialiser": "Reset",
  "Ville": "City",
  "Budget maximum (FCFA)": "Maximum budget (XAF)",
  "Sans limite": "No limit",
  "Logements à découvrir": "Properties to explore",
  "Aucun logement trouvé": "No properties found",
  "Disponible": "Available",
  "Annonce récente": "Recent listing",
  "par mois": "per month",
  "chambre(s)": "bedroom(s)",
  "Enregistré": "Saved",
  "Ajouter aux favoris": "Add to favorites",
  "Contacter le bailleur": "Contact the landlord",
  "Conseils logement": "Housing tips",
  "Vérifie les informations": "Check the information",
  "Examine les détails et l’adresse avant de te déplacer.": "Review the details and address before visiting.",
  "Reste prudent": "Stay cautious",
  "Évite les paiements sans vérification du logement.": "Avoid payments before verifying the property.",
  "Pose tes questions": "Ask your questions",
  "Demande les conditions de location avant la visite.": "Ask about rental conditions before visiting.",
  "Une façon plus simple de rechercher ou proposer un logement.": "A simpler way to find or list a property.",
  "Apparence": "Appearance",
  "Choisis l'apparence de ton application.": "Choose your app appearance.",
  "Thème de l'application": "App theme",
  "Clair": "Light",
  "Sombre": "Dark",
  "Automatique": "Automatic",
  "Ton choix est enregistré sur cet appareil.": "Your choice is saved on this device.",
  "Langue": "Language",
  "Choisis ta langue préférée.": "Choose your preferred language.",
  "La préférence est enregistrée. La traduction complète de l'interface reste à intégrer.": "Your preference is saved.",
  "Mon compte": "My account",
  "Informations de ton compte EazyHome.": "Your EazyHome account information.",
  "Pseudonyme": "Username",
  "Adresse e-mail": "Email address",
  "Type de compte": "Account type",
  "Préférence pour les notifications.": "Notification preferences.",
  "Activer les notifications": "Enable notifications",
  "Sécurité et session": "Security and session",
  "Déconnecte-toi de ton compte sur cet appareil.": "Log out of your account on this device.",
  "Filtrer les résultats": "Filter results",
  "Tous les logements": "All properties",
  "Studios": "Studios",
  "Appartements": "Apartments",
  "Maisons": "Houses",
  "Chambres": "Rooms"
};
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState("locataire");

  const [properties, setProperties] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertyError, setPropertyError] = useState("");

  


const [page, setPage] = useState("Accueil");








const [theme, setTheme] = useState(() => {
  try {
    return localStorage.getItem("eazyhome_theme") || "light";
  } catch {
    return "light";
  }
});
useEffect(() => {
  localStorage.setItem("eazyhome-theme", theme);
  document.documentElement.dataset.theme = theme;
}, [theme]);
const [language, setLanguage] = useState(() => {
  try {
    return localStorage.getItem("eazyhome_language") || "fr";
  } catch {
    return "fr";
  }
  
});

const [notificationsEnabled, setNotificationsEnabled] = useState(true);

useEffect(() => {
  try {
    localStorage.setItem("eazyhome_theme", theme);
  } catch {
    // Le thème reste utilisable pendant cette session.
  }

  document.documentElement.dataset.theme = theme;
}, [theme]);

useEffect(() => {
  try {
    localStorage.setItem("eazyhome_language", language);
  } catch {
    // La langue reste utilisable pendant cette session.
  }
}, [language]);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("eazyhome_favorites") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [showPostForm, setShowPostForm] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState("");
  const [postSuccess, setPostSuccess] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    city: "Douala",
    address: "",
    property_type: "appartement",
    bedrooms: "1",
    image_url: "",
  });

  const user = session?.user || null;
  const userRole = user?.user_metadata?.role || "locataire";

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Utilisateur";

  const userAvatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    "";

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!active) return;

        if (error) setAuthError(error.message);
        setSession(data?.session || null);
      } catch (error) {
        if (active) {
          setAuthError(error.message || "Connexion impossible.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadProperties = useCallback(async () => {
    setPropertiesLoading(true);
    setPropertyError("");

    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rows = data || [];
      setProperties(rows);

      const ownerIds = [
        ...new Set(rows.map((item) => item.owner_id).filter(Boolean)),
      ];

      if (ownerIds.length > 0) {
        const { data: profileRows, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", ownerIds);

        if (!profileError && profileRows) {
          const map = {};
          profileRows.forEach((profile) => {
            map[profile.id] = profile;
          });
          setProfiles(map);
        } else {
          setProfiles({});
        }
      } else {
        setProfiles({});
      }
    } catch (error) {
      setPropertyError(
        error.message ||
          "Impossible de charger les annonces. Vérifie ta connexion."
      );
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadProperties();
    } else {
      setProperties([]);
      setProfiles({});
    }
  }, [user, loadProperties]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "eazyhome_favorites",
        JSON.stringify(favorites)
      );
    } catch {
      // L'application continue de fonctionner si le stockage local est indisponible.
    }
  }, [favorites]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    try {
      if (authMode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              role,
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          setAuthSuccess("Compte créé avec succès.");
        } else {
          setAuthSuccess(
            "Compte créé. Vérifie ta boîte mail si une confirmation est demandée."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
      }
    } catch (error) {
      setAuthError(error.message || "Une erreur est survenue.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthError(error.message);
    } else {
      setPage("Accueil");
      setShowPostForm(false);
    }
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handlePhotoSelection(event) {
    const files = Array.from(event.target.files || []);
    setPostError("");

    if (files.length > MAX_PHOTOS) {
      setPostError(`Sélectionne ${MAX_PHOTOS} photos maximum.`);
      event.target.value = "";
      setSelectedPhotos([]);
      return;
    }

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setPostError("Formats acceptés : JPG, PNG et WebP.");
        event.target.value = "";
        setSelectedPhotos([]);
        return;
      }

      if (file.size > MAX_PHOTO_SIZE) {
        setPostError(
          `La photo "${file.name}" dépasse la limite de 5 Mo.`
        );
        event.target.value = "";
        setSelectedPhotos([]);
        return;
      }
    }

    setSelectedPhotos(files);
  }

  async function getLandlordIdentifier() {
  if (!user?.id) {
    throw new Error("Connecte-toi pour publier une annonce.");
  }

  // Crée une entrée uniquement si le bailleur n'en possède pas déjà une.
  const { error: insertError } = await supabase
    .from("landlord_ids")
    .upsert(
      { user_id: user.id },
      {
        onConflict: "user_id",
        ignoreDuplicates: true,
      }
    );

  if (insertError) {
    throw new Error(
      `Impossible de créer l'identifiant du bailleur : ${insertError.message}`
    );
  }

  const { data, error } = await supabase
    .from("landlord_ids")
    .select("landlord_number")
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(
      `Impossible de récupérer l'identifiant : ${error.message}`
    );
  }

  return `EZH-${String(data.landlord_number).padStart(6, "0")}`;
}

async function uploadPhotos(files) {
  const uploadedUrls = [];

  if (!files || files.length === 0) {
    return uploadedUrls;
  }

  const identifier = await getLandlordIdentifier();

  for (const file of files) {
    // Le filigrane est intégré dans les pixels de la photo.
    const watermarkedFile = await addWatermark(file, identifier);

    const filePath = `${user.id}/${crypto.randomUUID()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(filePath, watermarkedFile, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(
        `Envoi de "${file.name}" impossible : ${uploadError.message}`
      );
    }

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(filePath);

    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
}

  async function handlePublish(event) {
    event.preventDefault();
    setPostError("");
    setPostSuccess("");

    if (!user) {
      setPostError("Connecte-toi avant de publier.");
      return;
    }

    if (userRole !== "bailleur") {
      setPostError("Seuls les bailleurs peuvent publier une annonce.");
      return;
    }

    if (!form.title.trim() || !form.city.trim() || !form.price) {
      setPostError("Remplis au minimum le titre, la ville et le prix.");
      return;
    }

    const price = Number(form.price);
    const bedrooms = Number(form.bedrooms);

    if (!Number.isFinite(price) || price <= 0) {
      setPostError("Le prix doit être supérieur à zéro.");
      return;
    }

    if (
      selectedPhotos.length > MAX_PHOTOS ||
      selectedPhotos.some(
        (file) =>
          !ALLOWED_IMAGE_TYPES.includes(file.type) ||
          file.size > MAX_PHOTO_SIZE
      )
    ) {
      setPostError("Vérifie le format et la taille des photos sélectionnées.");
      return;
    }

    setPostLoading(true);

    try {
      const uploadedUrls = await uploadPhotos(selectedPhotos);
      const imageUrls = [...uploadedUrls];

      // Conserver la compatibilité avec les anciennes annonces utilisant une URL.
      if (imageUrls.length === 0 && form.image_url.trim()) {
        imageUrls.push(form.image_url.trim());
      }

      const now = new Date().toISOString();

      const payload = {
        owner_id: user.id,
        title: form.title.trim(),
        description: form.description.trim(),
        price,
        city: form.city.trim(),
        address: form.address.trim(),
        property_type: form.property_type,
        status: "available",
        bedrooms: Number.isFinite(bedrooms) ? bedrooms : 1,
        created_at: now,
        updated_at: now,
        images: imageUrls,
      };

      if (imageUrls.length > 0) {
        payload.image_url = imageUrls[0];
      }

      const { error } = await supabase
        .from("properties")
        .insert(payload);

      if (error) throw error;

      setForm({
        title: "",
        description: "",
        price: "",
        city: "Douala",
        address: "",
        property_type: "appartement",
        bedrooms: "1",
        image_url: "",
      });

      setSelectedPhotos([]);
      setShowPostForm(false);
      setPostSuccess("Annonce publiée avec succès.");
      setPage("Accueil");

      await loadProperties();
    } catch (error) {
      setPostError(
        error.message ||
          "Publication impossible. Vérifie la configuration Supabase."
      );
    } finally {
      setPostLoading(false);
    }
  }

  function toggleFavorite(propertyId) {
    setFavorites((current) =>
      current.includes(propertyId)
        ? current.filter((id) => id !== propertyId)
        : [...current, propertyId]
    );
  }

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
  if (page === "Mes annonces" && property.owner_id !== user.id) {
    return false;
  }

  const query = search.trim().toLowerCase();

      const searchableText = [
        property.title,
        property.description,
        property.city,
        property.address,
        property.property_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesCity =
        !cityFilter ||
        (property.city || "")
          .toLowerCase()
          .includes(cityFilter.toLowerCase());

      const matchesType =
        typeFilter === "all" ||
        property.property_type === typeFilter;

      const matchesPrice =
        !maxPrice || Number(property.price) <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCity &&
        matchesType &&
        matchesPrice
      );
    });
  }, [properties, search, cityFilter, typeFilter, maxPrice]);

  const displayedProperties =
    page === "Favoris"
      ? filteredProperties.filter((item) => favorites.includes(item.id))
      : page === "Mes annonces"
        ? filteredProperties.filter((item) => item.owner_id === user?.id)
        : filteredProperties;

  function getOwner(property) {
  const profile = profiles[property.owner_id] || {};

  return {
    name:
      profile.nickname ||
      (property.owner_id === user?.id
        ? userName
        : "Bailleur EazyHome"),
    avatar:
      profile.avatar_url ||
      profile.photo_url ||
      profile.profile_photo ||
      "",
  };
}

  function navigate(nextPage) {
    setPage(nextPage);
    setMobileMenuOpen(false);
    setShowPostForm(false);
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="brand-mark">E</div>
        <strong>EazyHome</strong>
        <span>Chargement de votre espace...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-intro">
          <div className="brand-lockup">
            <div className="brand-mark">E</div>
            <span>EazyHome</span>
          </div>

          <h1>La maison, plus simplement.</h1>

          <p>
            Découvre des logements, publie tes annonces et échange avec la
            communauté immobilière.
          </p>

          <div className="auth-benefits">
            <div><span>✓</span> Des annonces centralisées</div>
            <div><span>✓</span> Un espace pour bailleurs et locataires</div>
            <div><span>✓</span> Une recherche adaptée à tes besoins</div>
          </div>
        </section>

        <section className="auth-card">
          <h2>{authMode === "login" ? "Connexion" : "Créer un compte"}</h2>

          <p className="muted">
            {authMode === "login"
              ? "Connecte-toi pour accéder au fil d'actualité."
              : "Rejoins la communauté EazyHome."}
          </p>

          <form onSubmit={handleAuthSubmit} className="auth-form">
            {authMode === "register" && (
              <>
                <label htmlFor="fullName">Nom complet</label>
                <input
                  id="fullName"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Ex. Jean Dupont"
                  autoComplete="name"
                  required
                />

                <label htmlFor="role">Je suis</label>
                <select
                  id="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  <option value="locataire">Locataire</option>
                  <option value="bailleur">Bailleur</option>
                </select>
              </>
            )}

            <label htmlFor="email">Adresse e-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nom@exemple.com"
              autoComplete="email"
              required
            />

            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Au moins 6 caractères"
              autoComplete={
                authMode === "login"
                  ? "current-password"
                  : "new-password"
              }
              minLength={6}
              required
            />

            {authError && (
              <p className="message-error">{authError}</p>
            )}

            {authSuccess && (
              <p className="message-success">{authSuccess}</p>
            )}

            <button
              className="button button-primary button-wide"
              disabled={authLoading}
            >
              {authLoading
                ? "Patiente..."
                : authMode === "login"
                  ? "Se connecter"
                  : "Créer mon compte"}
            </button>
          </form>

          <div className="auth-switch">
            {authMode === "login"
              ? "Tu n'as pas encore de compte ?"
              : "Tu as déjà un compte ?"}

            <button
              type="button"
              className="text-button"
              onClick={() => {
                setAuthMode(
                  authMode === "login" ? "register" : "login"
                );
                setAuthError("");
                setAuthSuccess("");
              }}
            >
              {authMode === "login" ? "Inscris-toi" : "Connecte-toi"}
            </button>
          </div>
        </section>
      </main>
    );
  }

  
const navItems = [
  { label: "Accueil", icon: "home" },
  { label: "Notifications", icon: "bell" },
  { label: "Messagerie", icon: "message" },
  { label: "Profil", icon: "user" },
  { label: "Paramètres", icon: "settings" },
];


  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="mobile-menu-button icon-button"
            aria-label="Ouvrir le menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <Icon name="menu" />
          </button>

          <button
            className="brand-lockup brand-button"
            onClick={() => navigate("Accueil")}
          >
            <div className="brand-mark">E</div>
            <span>EazyHome</span>
          </button>

          <div className="top-search">
            <Icon name="search" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un logement..."
              aria-label="Rechercher un logement"
            />
          </div>
        </div>

        <nav className="top-navigation" aria-label="Navigation principale">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`top-nav-item ${page === item.label ? "active" : ""}`}
              onClick={() => navigate(item.label)}
              title={item.label}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="topbar-right">
          {userRole === "bailleur" && (
            <button
              className="button button-primary publish-top"
              onClick={() => {
                setPostError("");
                setShowPostForm(true);
              }}
            >
              <Icon name="plus" />
              <span>Publier</span>
            </button>
          )}

          <button
            className="profile-mini"
            onClick={() => navigate("Profil")}
          >
            <Avatar name={userName} src={userAvatar} />
            <span>{userName}</span>
          </button>

          <button
            className="icon-button logout-button"
            onClick={handleLogout}
            title="Déconnexion"
          >
            <Icon name="logout" />
          </button>
        </div>
      </header>

      <div className="mobile-search">
        <Icon name="search" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un logement..."
        />
      </div>

      <div className="main-layout">
        <aside className={`left-sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-user">
            <Avatar name={userName} src={userAvatar} size="large" />
            <div>
              <strong>{userName}</strong>
              <span>{userRole === "bailleur" ? "Bailleur" : "Locataire"}</span>
            </div>
          </div>

          <div className="sidebar-divider" />
          <p className="sidebar-heading">Menu</p>

          {navItems.map((item) => (
            <button
              key={item.label}
              className={`sidebar-link ${page === item.label ? "selected" : ""}`}
              onClick={() => navigate(item.label)}
            >
              <span className="sidebar-icon"><Icon name={item.icon} /></span>
              <span>{item.label}</span>
            </button>
          ))}

          <button
            className={`sidebar-link ${page === "Favoris" ? "selected" : ""}`}
            onClick={() => navigate("Favoris")}
          >
            <span className="sidebar-icon"><Icon name="heart" /></span>
            <span>Mes favoris</span>
          </button>

          {userRole === "bailleur" && (
            <button
              className={`sidebar-link ${page === "Mes annonces" ? "selected" : ""}`}
              onClick={() => navigate("Mes annonces")}
            >
              <span className="sidebar-icon"><Icon name="home" /></span>
              <span>Mes annonces</span>
            </button>
          )}

          <div className="sidebar-divider" />
          <p className="sidebar-heading">EazyHome</p>

          <div className="sidebar-note">
            <strong>La maison facile</strong>
            <p>Un espace pour découvrir et proposer des logements.</p>
          </div>

          <button className="sidebar-link logout-mobile" onClick={handleLogout}>
            <span className="sidebar-icon"><Icon name="logout" /></span>
            <span>Déconnexion</span>
          </button>
        </aside>

        <main className="feed-column">
          {page === "Accueil" && (
            <>
              <div className="feed-heading">
                <div>
                  <h1>Fil d’actualité</h1>
                  <p>Les logements publiés sur EazyHome.</p>
                </div>
                <span className="feed-count">
                  {filteredProperties.length} annonce(s)
                </span>
              </div>

              <section className="welcome-card">
                <div className="welcome-copy">
                  <span className="eyebrow">BIENVENUE SUR EAZYHOME</span>
                  <h2>Trouve ton prochain chez-toi.</h2>
                  <p>Explore les annonces et affine ta recherche.</p>
                </div>
                <div className="welcome-symbol">E</div>
              </section>
            </>
          )}

          {userRole === "bailleur" && page === "Accueil" && (
            <section className="create-post-card">
              <div className="create-post-top">
                <Avatar name={userName} src={userAvatar} />
                <button
                  onClick={() => {
                    setPostError("");
                    setShowPostForm(true);
                  }}
                >
                  Publier une annonce immobilière...
                </button>
              </div>

              <div className="create-post-bottom">
                <span><Icon name="home" /> Logement</span>
                <button
                  onClick={() => {
                    setPostError("");
                    setShowPostForm(true);
                  }}
                >
                  <Icon name="plus" /> Créer une annonce
                </button>
              </div>
            </section>
          )}

          {showPostForm && userRole === "bailleur" && (
            <section className="panel post-form-panel">
              <div className="panel-heading">
                <div>
                  <h2>Nouvelle annonce</h2>
                  <p>Présente clairement le logement à louer.</p>
                </div>

                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setShowPostForm(false)}
                  aria-label="Fermer"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handlePublish} className="property-form">
                <label htmlFor="title">Titre de l’annonce *</label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={updateForm}
                  placeholder="Ex. Studio moderne à louer"
                  required
                />

                <div className="form-two-columns">
                  <div>
                    <label htmlFor="price">Prix mensuel en FCFA *</label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="1"
                      value={form.price}
                      onChange={updateForm}
                      placeholder="Ex. 75000"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="property_type">Type de logement</label>
                    <select
                      id="property_type"
                      name="property_type"
                      value={form.property_type}
                      onChange={updateForm}
                    >
                      <option value="studio">Studio</option>
                      <option value="appartement">Appartement</option>
                      <option value="maison">Maison</option>
                      <option value="chambre">Chambre</option>
                    </select>
                  </div>
                </div>

                <div className="form-two-columns">
                  <div>
                    <label htmlFor="city">Ville *</label>
                    <select
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={updateForm}
                    >
                      <option>Douala</option>
                      <option>Yaoundé</option>
                      <option>Bafoussam</option>
                      <option>Garoua</option>
                      <option>Bamenda</option>
                      <option>Kribi</option>
                      <option>Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bedrooms">Nombre de chambres</label>
                    <input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      min="0"
                      value={form.bedrooms}
                      onChange={updateForm}
                    />
                  </div>
                </div>

                <label htmlFor="address">Quartier / adresse</label>
                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={updateForm}
                  placeholder="Ex. Bonamoussadi, Denver"
                />

                <label htmlFor="propertyPhotos">
                  Photos du logement (5 maximum)
                </label>

                <input
                  id="propertyPhotos"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handlePhotoSelection}
                />

                <p className="field-help">
                  Formats acceptés : JPG, PNG et WebP. Taille maximale :
                  5 Mo par photo.
                </p>

                {selectedPhotos.length > 0 && (
                  <div
                    className="selected-photos"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px",
                      margin: "12px 0",
                    }}
                  >
                    {selectedPhotos.map((photo, index) => (
                      <div
                        key={`${photo.name}-${index}`}
                        style={{ maxWidth: "120px" }}
                      >
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Aperçu ${index + 1}`}
                          style={{
                            width: "110px",
                            height: "85px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <p style={{ fontSize: "12px", overflowWrap: "anywhere" }}>
                          {photo.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <label htmlFor="image_url">
                  Ou lien direct vers une photo existante
                </label>
                <input
                  id="image_url"
                  name="image_url"
                  type="url"
                  value={form.image_url}
                  onChange={updateForm}
                  placeholder="https://exemple.com/photo.jpg"
                />

                <label htmlFor="description">Description du logement</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                  placeholder="Décris le logement, les équipements et les conditions..."
                  rows="4"
                />

                {postError && (
                  <p className="message-error">{postError}</p>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    className="button button-light"
                    disabled={postLoading}
                    onClick={() => {
                      setShowPostForm(false);
                      setPostError("");
                    }}
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="button button-primary"
                    disabled={postLoading}
                  >
                    {postLoading ? "Envoi des photos et publication..." : "Publier l’annonce"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {postSuccess && (
            <div className="message-success inline-message">
              {postSuccess}
              <button onClick={() => setPostSuccess("")}>×</button>
            </div>
          )}

          {page === "Notifications" && (
            <section className="panel empty-state">
              <div className="empty-icon"><Icon name="bell" /></div>
              <h2>Notifications</h2>
              <p>
                Les notifications apparaîtront ici lorsque les événements
                et alertes seront configurés.
              </p>
            </section>
          )}

          {page === "Messagerie" && (
            <section className="panel empty-state">
              <div className="empty-icon"><Icon name="message" /></div>
              <h2>Messagerie</h2>
              <p>
                La messagerie en temps réel n’est pas encore activée.
                Les conversations nécessitent une table dédiée et des
                règles d’accès dans Supabase.
              </p>
            </section>
          )}

          {page === "Profil" && (
            <section className="panel profile-panel">
              <div className="profile-cover" />
              <div className="profile-details">
                <Avatar name={userName} src={userAvatar} size="profile" />
                <h2>{userName}</h2>
                <p>{user.email}</p>

                <span className="role-badge">
                  {userRole === "bailleur" ? "Bailleur" : "Locataire"}
                </span>

                {userRole === "bailleur" && (
                  <button
                    className="button button-primary"
                    onClick={() => {
                      setPage("Accueil");
                      setPostError("");
                      setShowPostForm(true);
                    }}
                  >
                    <Icon name="plus" /> Publier une annonce
                  </button>
                )}

                <button className="button button-light" onClick={handleLogout}>
                  <Icon name="logout" /> Déconnexion
                </button>
              </div>
            </section>
          )}

{page === "Paramètres" && (
  <section className="settings-page">
    <div className="settings-header">
      <h1>Paramètres</h1>
      <p>Personnalise ton expérience EazyHome.</p>
    </div>

    <section className="settings-card">
      <div className="settings-card-heading">
        <span className="settings-symbol">◐</span>
        <div>
          <h2>Apparence</h2>
          <p>Choisis l'apparence de ton application.</p>
        </div>
      </div>

      <label htmlFor="theme-choice">Thème de l'application</label>
      <select
        id="theme-choice"
        value={theme}
        onChange={(event) => setTheme(event.target.value)}
      >
        <option value="light">Clair</option>
        <option value="dark">Sombre</option>
        <option value="auto">Automatique</option>
      </select>

      <p className="settings-help">
        Ton choix est enregistré sur cet appareil.
      </p>
    </section>

    <section className="settings-card">
      <div className="settings-card-heading">
        <span className="settings-symbol">文</span>
        <div>
          <h2>Langue</h2>
          <p>Choisis ta langue préférée.</p>
        </div>
      </div>

      <label htmlFor="language-choice">Langue</label>
      <select
        id="language-choice"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>

      <p className="settings-help">
        La préférence est enregistrée. La traduction complète
        de l'interface reste à intégrer.
      </p>
    </section>

    <section className="settings-card">
      <div className="settings-card-heading">
        <span className="settings-symbol">@</span>
        <div>
          <h2>Mon compte</h2>
          <p>Informations de ton compte EazyHome.</p>
        </div>
      </div>

      <div className="settings-info-row">
        <span>Pseudonyme</span>
        <strong>
          @{user.user_metadata?.nickname || userName}
        </strong>
      </div>

      <div className="settings-info-row">
        <span>Adresse e-mail</span>
        <strong>{user.email}</strong>
      </div>

      <div className="settings-info-row">
        <span>Type de compte</span>
        <strong>
          {userRole === "bailleur" ? "Bailleur" : "Locataire"}
        </strong>
      </div>
    </section>

    <section className="settings-card">
      <div className="settings-card-heading">
        <span className="settings-symbol">♧</span>
        <div>
          <h2>Notifications</h2>
          <p>Préférence pour les notifications.</p>
        </div>
      </div>

      <label className="settings-toggle">
        <span>Activer les notifications</span>
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={(event) =>
            setNotificationsEnabled(event.target.checked)
          }
        />
      </label>

      <p className="settings-help">
        Ce réglage mémorise uniquement ta préférence dans
        l'interface. Les notifications réelles restent à configurer.
      </p>
    </section>

    <section className="settings-card settings-danger-card">
      <h2>Sécurité et session</h2>
      <p>Déconnecte-toi de ton compte sur cet appareil.</p>
      <button
        className="button button-light"
        onClick={handleLogout}
      >
        <Icon name="logout" />
        Déconnexion
      </button>
    </section>
  </section>
)}

          {(page === "Accueil" ||
            page === "Favoris" ||
            page === "Mes annonces") && (
            <>
              <section className="filter-panel">
                <div className="filter-title">
                  <div>
                    <h2>
                      {page === "Favoris"
                        ? "Mes favoris"
                        : page === "Mes annonces"
                          ? "Mes annonces"
                          : "Logements à découvrir"}
                    </h2>
                    <p>Filtre les résultats selon tes critères.</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => {
                      setSearch("");
                      setCityFilter("");
                      setTypeFilter("all");
                      setMaxPrice("");
                    }}
                  >
                    Réinitialiser
                  </button>
                </div>

                <div className="filter-controls">
                  <label>
                    <span>Ville</span>
                    <input
                      value={cityFilter}
                      onChange={(event) => setCityFilter(event.target.value)}
                      placeholder="Douala, Yaoundé..."
                    />
                  </label>

                  <label>
                    <span>Type de logement</span>
                    <select
                      value={typeFilter}
                      onChange={(event) => setTypeFilter(event.target.value)}
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Budget maximum (FCFA)</span>
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                      placeholder="Sans limite"
                    />
                  </label>
                </div>
              </section>

              {propertyError && (
                <div className="message-error inline-message">
                  {propertyError}
                  <button onClick={loadProperties}>Réessayer</button>
                </div>
              )}

              {propertiesLoading ? (
                <div className="panel loading-panel">
                  Chargement des annonces...
                </div>
              ) : displayedProperties.length === 0 ? (
                <section className="panel empty-state">
                  <div className="empty-icon"><Icon name="home" /></div>
                  <h2>Aucun logement trouvé</h2>
                  <p>
                    {page === "Favoris"
                      ? "Tu n’as pas encore ajouté de logement à tes favoris."
                      : "Aucune annonce ne correspond à ta recherche pour le moment."}
                  </p>

                  {userRole === "bailleur" && page !== "Favoris" && (
                    <button
                      className="button button-primary"
                      onClick={() => {
                        setPostError("");
                        setShowPostForm(true);
                      }}
                    >
                      Publier la première annonce
                    </button>
                  )}
                </section>
              ) : (
                <div className="feed-list">
                  {displayedProperties.map((property) => {
                    const owner = getOwner(property);
                    const isFavorite = favorites.includes(property.id);

                    const images =
                      Array.isArray(property.images) &&
                      property.images.length > 0
                        ? property.images
                        : property.image_url
                          ? [property.image_url]
                          : [];

                    return (
                      <article className="property-post" key={property.id}>
                        <div className="post-header">
                          <Avatar name={owner.name} src={owner.avatar} />

                          <div className="post-owner">
                            <strong>{owner.name}</strong>
                            <span>
                              Bailleur ·{" "}
                              {property.created_at
                                ? new Date(
                                    property.created_at
                                  ).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "Annonce récente"}
                            </span>
                          </div>

                          <span className="availability-pill">
                            {property.status === "available"
                              ? "Disponible"
                              : property.status || "Annonce"}
                          </span>
                        </div>

                        <div className="post-text">
                          <h2>{property.title}</h2>
                          <p>
                            <span className="post-location">
                              <Icon name="map" />
                              {[property.address, property.city]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </p>

                          {property.description && (
                            <p className="post-description">
                              {property.description}
                            </p>
                          )}
                        </div>

                        {images.length > 0 ? (
                          <div
                            className="post-image-wrap"
                            style={{
                              display: "flex",
                              gap: "8px",
                              overflowX: "auto",
                              padding: "8px 0",
                            }}
                          >
                            {images.map((imageUrl, index) => (
                              <img
                                key={`${imageUrl}-${index}`}
                                className="post-image"
                                src={imageUrl}
                                alt={`${property.title} — photo ${index + 1}`}
                                loading="lazy"
                                style={{
                                  flex: "0 0 85%",
                                  maxWidth: "85%",
                                  objectFit: "cover",
                                }}
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="post-image-placeholder">
                            <Icon name="home" />
                            <span>Photo du logement non disponible</span>
                          </div>
                        )}

                        <div className="post-property-facts">
                          <div className="price-block">
                            <strong>{formatPrice(property.price)}</strong>
                            <span>par mois</span>
                          </div>

                          <div className="property-fact">
                            <Icon name="bed" />
                            <span>{property.bedrooms ?? 0} chambre(s)</span>
                          </div>

                          <span className="type-chip">
                            {property.property_type || "Logement"}
                          </span>
                        </div>

                        <div className="post-actions">
                          <button
                            className={isFavorite ? "favorite-active" : ""}
                            onClick={() => toggleFavorite(property.id)}
                          >
                            <Icon name="heart" />
                            {isFavorite
                              ? "Enregistré"
                              : "Ajouter aux favoris"}
                          </button>

                          <button
                            onClick={() =>
                              window.alert(
                                "Le contact direct sera activé après la mise en place de la messagerie et des règles de sécurité."
                              )
                            }
                          >
                            <Icon name="message" />
                            Contacter le bailleur
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <footer className="feed-footer">
            <strong>EazyHome</strong> · La maison facile
            <span>© {new Date().getFullYear()} EazyHome</span>
          </footer>
        </main>

        <aside className="right-sidebar">
          <section className="right-card">
            <div className="right-card-heading">
              <h3>Conseils logement</h3>
            </div>

            <div className="tip-item">
              <span className="tip-number">01</span>
              <div>
                <strong>Vérifie les informations</strong>
                <p>Examine les détails et l’adresse avant de te déplacer.</p>
              </div>
            </div>

            <div className="tip-item">
              <span className="tip-number">02</span>
              <div>
                <strong>Reste prudent</strong>
                <p>Évite les paiements sans vérification du logement.</p>
              </div>
            </div>

            <div className="tip-item">
              <span className="tip-number">03</span>
              <div>
                <strong>Pose tes questions</strong>
                <p>Demande les conditions de location avant la visite.</p>
              </div>
            </div>
          </section>

          <section className="right-card about-card">
            <div className="about-brand">
              <div className="brand-mark">E</div>
              <strong>EazyHome</strong>
            </div>
            <p>Une façon plus simple de rechercher ou proposer un logement.</p>
            <span>Orange · Blanc · Gris foncé</span>
          </section>
        </aside>
      </div>

      <nav className="mobile-bottom-nav" aria-label="Navigation mobile">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={page === item.label ? "active" : ""}
            onClick={() => navigate(item.label)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
  
}

export default App;

