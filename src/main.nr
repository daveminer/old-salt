mod test;
use dep::aztec::macros::aztec;

#[aztec]
pub contract PrivateVoting {
    use dep::aztec::{
        context::PrivateContext,
        keys::getters::get_public_keys,
        macros::{functions::{initializer, internal, private, public, utility}, notes::note, storage::storage},
    };
    use dep::aztec::note::note_interface::{NoteHash, NoteType};
    use dep::aztec::protocol_types::{
        address::AztecAddress,
        hash::poseidon2_hash,
        traits::{Hash, Packable, Serialize, ToField},
    };
    use dep::aztec::state_vars::{Map, PrivateSet, PublicImmutable, PublicMutable};

    #[derive(Eq,Packable, Serialize)]
    pub struct Ship {
        pub firepower: u32,
        pub armor: u32,
        pub speed: u32,
    }

    #[derive(Eq, Packable, Serialize)]
    #[note]
    pub struct VoyageNote {
        owner: AztecAddress,
        ship: Ship,
        route: AztecAddress,
    }

    // impl NoteType for VoyageNote {
    //     // fn get_note_type_id() -> Field {
    //     //     // Use a unique value for your note type.
    //     //     // Example: python -c "print(int(''.join(str(ord(c)) for c in 'VoyageNote')))"
    //     //     861119711111010110116101
    //     // }
    //     fn get_id() -> Field {
    //         1
    //     }
    // }

    // impl NoteHash for VoyageNote {
    //     // fn compute_note_content_hash(self) -> Field {
    //     //     // Use your preferred hash function and fields
    //     //     pedersen_hash([self.ship.to_field(), self.route.to_field()], 0)
    //     // }
    //     fn compute_note_hash(self, storage_slot: Field) -> Field {
    //         1
    //         //pedersen_hash([self.ship.to_field(), self.route.to_field(), storage_slot], 0)
    //     }

    //     fn compute_nullifier(self, context: &mut PrivateContext, note_hash_for_nullification: Field) -> Field {
    //         1
    //         //pedersen_hash([self.ship.to_field(), self.route.to_field(), storage_slot], 0)
    //     }

    //     unconstrained fn compute_nullifier_unconstrained(self, storage_slot: Field) -> Field {
    //         1
    //         //pedersen_hash([self.ship.to_field(), self.route.to_field(), storage_slot], 0)
    //     }
    // }

    // #[derive(Eq, Packable, Serialize)]
    // impl VoyageNote {
    //     fn new(ship: Ship, route: AztecAddress) -> VoyageNote {
    //         VoyageNote {
    //             ship: ship,
    //             route: route,
    //         }
    //     }
    // }

    struct AmbushNote {
        ship: Ship,
        route: AztecAddress,
    }

    struct BattleNote {
        attacker: VoyageNote,
        defender: AmbushNote,
    }


    #[storage]
    struct Storage<Context> {
        admin: PublicMutable<AztecAddress, Context>, // admin can end vote
        tally: Map<Field, PublicMutable<Field, Context>, Context>, // we will store candidate as key and number of votes as value
        vote_ended: PublicMutable<bool, Context>, // vote_ended is boolean
        active_at_block: PublicImmutable<u32, Context>, // when people can start voting

        voyages: PrivateSet<VoyageNote, Context>,
        ambushes: PrivateSet<AmbushNote, Context>,
        battles: PrivateSet<BattleNote, Context>
    }

    #[public]
    #[initializer]
    // annotation to mark function as a constructor
    fn constructor(admin: AztecAddress) {
        storage.admin.write(admin);
        storage.vote_ended.write(false);
        storage.active_at_block.initialize(context.block_number());
    }

    #[private]
    fn create_voyage(ship: Ship, route: AztecAddress) {
        let voyage_note = VoyageNote {
            owner: context.msg_sender(),
            ship: ship,
            route: route,
        };
        storage.voyages.insert(voyage_note);
    }

    #[private]
    // annotation to mark function as private and expose private context
    fn cast_vote(candidate: Field) {
        let msg_sender_nullifier_public_key_message_hash =
            get_public_keys(context.msg_sender()).npk_m.hash();

        let secret = context.request_nsk_app(msg_sender_nullifier_public_key_message_hash); // get secret key of caller of function
        let nullifier = poseidon2_hash([context.msg_sender().to_field(), secret]); // derive nullifier from sender and secret
        context.push_nullifier(nullifier);
        PrivateVoting::at(context.this_address()).add_to_tally_public(candidate).enqueue(
            &mut context,
        );
    }

    #[public]
    #[internal]
    fn add_to_tally_public(candidate: Field) {
        assert(storage.vote_ended.read() == false, "Vote has ended"); // assert that vote has not ended
        let new_tally = storage.tally.at(candidate).read() + 1;
        storage.tally.at(candidate).write(new_tally);
    }

    #[public]
    fn end_vote() {
        assert(storage.admin.read().eq(context.msg_sender()), "Only admin can end votes"); // assert that caller is admin
        storage.vote_ended.write(true);
    }
    #[utility]
    unconstrained fn get_vote(candidate: Field) -> Field {
        storage.tally.at(candidate).read()
    }
    
    #[private]
    fn check_voyage_exists(ship: Ship, route: AztecAddress) -> bool {
        let voyage_note = VoyageNote {
            owner: context.msg_sender(),
            ship: ship,
            route: route,
        };
        storage.voyages.contains(voyage_note)
    }
}
