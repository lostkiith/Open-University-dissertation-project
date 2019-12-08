package TM470Project.Model;

import lombok.Data;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import java.time.LocalDateTime;
import java.util.HashSet;

@Data
public class Note {
    private String note;
    private int priority;
    private HashSet<Long> hasBeenReadBy;
    private LocalDateTime Created;

    @Contract(pure = true)
    private Note(@NotNull String note, int priority) {
        this.note = note;
        this.priority = priority;
        this.hasBeenReadBy = new HashSet<>();
        this.Created = LocalDateTime.now();
    }

    @NotNull
    @Contract(value = "_, _ -> new", pure = true)
    static Note createNote(String note, int priority) {
        return new Note(note, priority);
    }

    public void hasBeenReadyBy(Long nationalHealthServiceNumber) {
        this.hasBeenReadBy.add(nationalHealthServiceNumber);
    }

    @Contract(value = "null -> false", pure = true)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Note)) return false;

        Note note1 = (Note) o;

        if (priority != note1.priority) return false;
        if (!note.equals(note1.note)) return false;
        if (!hasBeenReadBy.equals(note1.hasBeenReadBy)) return false;
        return Created.equals(note1.Created);
    }

    @Override
    public int hashCode() {
        int result = note.hashCode();
        result = 31 * result + priority;
        result = 31 * result + hasBeenReadBy.hashCode();
        result = 31 * result + Created.hashCode();
        return result;
    }

}

