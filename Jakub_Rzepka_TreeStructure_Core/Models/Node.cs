using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Jakub_Rzepka_TreeStructure_Core.Models
{
    public class Node
    {
        public Node()
        {
            SubNodes = new List<Node>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Name { get; set; }

        public int? ParentNodeId { get; set; }

        public virtual Node ParentNode { get; set; }

        public virtual List<Node> SubNodes { get; set; }
    }
}
