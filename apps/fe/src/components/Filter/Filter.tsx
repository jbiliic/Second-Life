type ListingFiltersProps = {
    onClose: () => void;
};

const Filter = ({ onClose }: ListingFiltersProps) => {
    return (
        <div>
            <h2>Filteri</h2>

            <button onClick={onClose}>Primijeni filtere</button>
        </div>
    );
};

export default Filter;
