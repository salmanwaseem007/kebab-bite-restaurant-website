import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Debug "mo:base/Debug";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import OutCall "http-outcalls/outcall";



actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();

  // Initialize auth (first caller becomes admin, others become users)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    // Other user metadata if needed
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view profiles");
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // User management type for admin panel
  public type UserWithRole = {
    principal : Principal;
    role : AccessControl.UserRole;
  };

  // Get all users with their roles (admin-only)
  public query ({ caller }) func getAllUsers() : async [UserWithRole] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all users");
    };

    // This function should be implemented by the AccessControl module
    // For now, we return an empty array as a placeholder
    // The actual implementation would need to expose user data from AccessControl
    [];
  };

  // Storage setup
  let storage = Storage.new();
  include MixinStorage(storage);

  // Data types
  public type MenuPhoto = {
    id : Text;
    url : Text;
    order : Nat;
    name : Text;
  };

  public type ContactInfo = {
    restaurantName : Text;
    whatsapp : Text;
    address : Text;
    email : Text;
    openingHours : Text;
    latitude : Float;
    longitude : Float;
  };

  // Default contact info
  let defaultContactInfo : ContactInfo = {
    restaurantName = "Kebab Bite";
    whatsapp = "+34 614 55 18 97";
    address = "C. el Niño, 4, 29400 Ronda, Málaga";
    email = "mian.ftikhar@gmail.com";
    openingHours = "Lunes: 13:00 – 16:00, 19:00 – 00:00\nMartes: 13:00 – 16:00, 19:00 – 00:00\nMiércoles: 13:00 – 16:00, 19:00 – 00:00\nJueves: 13:00 – 16:00, 19:00 – 00:00\nViernes: 13:00 – 16:00, 19:00 – 01:00\nSábado: 13:00 – 16:00, 19:00 – 01:00\nDomingo: 13:00 – 16:00, 19:00 – 01:00";
    latitude = 36.744078;
    longitude = -5.166929;
  };

  // OrderedMap for menu photos
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var menuPhotos = textMap.empty<MenuPhoto>();
  var contactInfo : ContactInfo = defaultContactInfo;

  // Menu Photos Management
  public shared ({ caller }) func addMenuPhoto(photo : MenuPhoto) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add menu photos");
    };
    menuPhotos := textMap.put(menuPhotos, photo.id, photo);
  };

  public shared ({ caller }) func deleteMenuPhoto(photoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete menu photos");
    };
    menuPhotos := textMap.delete(menuPhotos, photoId);
  };

  public shared ({ caller }) func reorderMenuPhotos(photoIds : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can reorder menu photos");
    };

    var newPhotos = textMap.empty<MenuPhoto>();
    var order = 0;

    for (photoId in photoIds.vals()) {
      switch (textMap.get(menuPhotos, photoId)) {
        case (?photo) {
          let updatedPhoto : MenuPhoto = {
            id = photo.id;
            url = photo.url;
            order;
            name = photo.name;
          };
          newPhotos := textMap.put(newPhotos, photoId, updatedPhoto);
          order += 1;
        };
        case null {};
      };
    };

    menuPhotos := newPhotos;
  };

  public query func getMenuPhotos() : async [MenuPhoto] {
    // Public access - menu photos should be visible to everyone
    let photosArray = Iter.toArray(textMap.vals(menuPhotos));
    Array.sort(
      photosArray,
      func(a : MenuPhoto, b : MenuPhoto) : { #less; #equal; #greater } {
        if (a.order < b.order) { #less } else if (a.order > b.order) {
          #greater;
        } else { #equal };
      },
    );
  };

  // Contact Info Management
  public shared ({ caller }) func updateContactInfo(info : ContactInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update contact info");
    };
    contactInfo := info;
  };

  public query func getContactInfo() : async ContactInfo {
    // Public access - contact info should be visible to everyone
    contactInfo;
  };

  // HTTP Outcall Transformation for CORS
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    // Public query - needed for HTTP outcalls, no authorization required
    let trustedOrigins = [
      "https://www.kebabbite.com",
      "https://kebabbite.com",
    ];

    let originHeader = switch (input.response.headers) {
      case (headers) {
        var foundOrigin : ?Text = null;
        for (header in headers.vals()) {
          if (Text.equal(header.name, "Origin")) {
            foundOrigin := ?header.value;
          };
        };
        foundOrigin;
      };
    };

    let isTrustedOrigin = switch (originHeader) {
      case (?origin) {
        var trusted = false;
        for (trustedOrigin in trustedOrigins.vals()) {
          if (Text.equal(origin, trustedOrigin)) {
            trusted := true;
          };
        };
        trusted;
      };
      case null { false };
    };

    let corsHeaders = if (isTrustedOrigin) {
      [
        {
          name = "Access-Control-Allow-Origin";
          value = switch (originHeader) {
            case (?origin) { origin };
            case null { "" };
          };
        },
        {
          name = "Access-Control-Allow-Methods";
          value = "GET, POST, PUT, DELETE, OPTIONS";
        },
        {
          name = "Access-Control-Allow-Headers";
          value = "Content-Type, Authorization";
        },
      ];
    } else { [] };

    {
      input.response with
      headers = Array.append(input.response.headers, corsHeaders);
    };
  };
};

