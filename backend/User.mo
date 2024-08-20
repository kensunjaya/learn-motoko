import Text "mo:base/Text";
import Trie "mo:base/Trie";
import Nat32 "mo:base/Nat32";
actor User {

  public type UserId = Nat32;

  public type Users = {
    username : Text;
    email : Text;
  };

  private stable var id : UserId = 0;

  private stable var users : Trie.Trie<UserId, Users> = Trie.empty();

  public func createUser(user : Users) : async UserId {
    let user_id = id;
    id += 1;
    users := Trie.replace(
      users,
      key(user_id),
      Nat32.equal,
      ?user,
    ).0;

    return user_id;
  };

  public func read(user_id : UserId) : async ?Users {
    let result = Trie.find(users, key(user_id), Nat32.equal);
    return result;
  };

  private func key(x : UserId) : Trie.Key<UserId> {
    return { hash = x; key = x };
  };

};
