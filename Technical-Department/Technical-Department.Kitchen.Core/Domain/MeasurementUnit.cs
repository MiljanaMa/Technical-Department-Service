using Explorer.BuildingBlocks.Core.Domain;
using System.Text.Json.Serialization;


namespace Technical_Department.Kitchen.Core.Domain
{
    public class MeasurementUnit : ValueObject<MeasurementUnit>
    {
        public string Name { get; }
        public string ShortName { get; }
        [JsonConstructor]
        public MeasurementUnit(string name, string shortName)
        {
            Name = name;
            ShortName = shortName;
        }
        protected override bool EqualsCore(MeasurementUnit measurementUnit)
        {
            return Name.Equals(measurementUnit.Name) &&
                   ShortName.Equals(measurementUnit.ShortName);
        }

        protected override int GetHashCodeCore()
        {
            throw new NotImplementedException();
        }
    }
}
