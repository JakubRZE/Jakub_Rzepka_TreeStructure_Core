using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Jakub_Rzepka_TreeStructure_Core.ViewModels
{
    public class NodeVM
    {
        public int Id{ get; set; }

        [Required]
        public string Name { get; set; }

        public int? ParentNodeId { get; set; }
    }
}
