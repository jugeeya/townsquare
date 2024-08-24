<template>
  <Modal class="winner" v-if="modals.winner" @close="toggleModal('winner')">
    <h3>Export Winner</h3>
    <div class="button-container">
      <div
        class="button townsfolk"
        :class="{ selected: winner === 'townsfolk' }"
        @click="setWinner('townsfolk')"
      >
        <img src="../../assets/icons/virgin.png" class="icon" /> Town
      </div>
      <div
        class="button demon"
        :class="{ selected: winner === 'demon' }"
        @click="setWinner('demon')"
      >
        <img src="../../assets/icons/imp.png" class="icon" /> Demon
      </div>
    </div>

    <div>
      <label for="email">Email Address: </label>
      <input type="email" v-model="email" id="email" />
    </div>

    <h4>Preview</h4>
    <textarea
      :value="gameresults"
      @input.stop="input = $event.target.value"
      @click="$event.target.select()"
      @keyup.stop=""
    ></textarea>

    <div class="export-button-container">
      <div class="button fabled" @click="exportResult">Export Result</div>
    </div>

    <p class="note">
      Ensure mailto is enabled in your browser. 
      <a href="https://stackoverflow.com/a/17647243" target="_blank"
        >See here for more details.</a
      >
    </p>
  </Modal>
</template>

<script>
import Modal from "./Modal";
import { mapMutations, mapState } from "vuex";

export default {
  components: {
    Modal,
  },
  computed: {
    gameresults: function () {
      const gameState = {
        bluffs: this.players.bluffs.map(({ id }) => id),
        edition: this.edition.isOfficial
          ? { id: this.edition.id }
          : this.edition,
        roles: this.edition.isOfficial
          ? ""
          : this.$store.getters.customRolesStripped,
        fabled: this.players.fabled.map((fabled) =>
          fabled.isCustom ? fabled : { id: fabled.id }
        ),
        players: this.players.players.map((player) => ({
          ...player,
          role: player.role.id || {},
        })),
      };

      const tableHeader = "Player\tRole\tWinner\n";
      const tableRows = gameState.players
        .map(
          (player) =>
            `${player.name}\t${
              this.$store.state.roles.get(player.role).name
            }\t${
              this.$store.state.roles.get(player.role).team === this.winner
                ? "Yes"
                : "No"
            }`,
        )
        .join("\n");
      const table = tableHeader + tableRows;
      return table;
    },
    ...mapState(["modals", "players", "edition", "roles", "session"]),
  },
  data() {
    return {
      winner: "",
      email: "",
    };
  },
  methods: {
    setWinner: function (team) {
      if (this.winner === team) {
        this.winner = "";
      } else {
        this.winner = team;
      }
    },
    exportResult: function () {
      if (this.email && this.winner) {
        const table = this.gameresults;

        const currentDate = new Date();

        const subject = encodeURIComponent(
          "Blood on the Clocktower Results: " + currentDate.toLocaleString()
        );
        const body = encodeURIComponent(`${table}`);
        const mailtoLink = `mailto:${this.email}?subject=${subject}&body=${body}`;
        window.open(mailtoLink);
      } else {
        alert("Please select a winner and enter an email address.");
      }
    },
    ...mapMutations(["toggleModal"]),
  },
};
</script>

<style lang="scss" scoped>
@import "../../vars.scss";

h3 {
  margin: 0 40px;
}

textarea {
  background: transparent;
  color: white;
  white-space: pre-wrap;
  word-break: break-all;
  border: 1px solid rgba(255, 255, 255, 0.5);
  width: 60vw;
  height: 30vh;
  max-width: 100%;
  margin: 5px 0;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.button {
  display: inline-block;
  color: gray;
  display: flex;
}

.button.selected {
  background-color: #007bff;
  color: white;
}

.icon {
  width: 40px;
  height: 40px;
}

.export-button-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
